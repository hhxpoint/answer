# -*- coding: utf-8 -*-
"""打包部署题库资源：本地 tar → 上传单文件 → 服务器解包 → 校验。

比逐文件 SFTP 快一到两个数量级（3700+ 小文件）。
"""
import io
import os
import sys
import tarfile

import paramiko

HOST = os.environ.get('POINT_HOST', '20.98.97.86')
USER = os.environ.get('POINT_USER', 'point')
PASS = os.environ['POINT_PASS']

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, 'dist')
REMOTE = '/home/point/couple/uploads/exam'
TAR = os.path.join(HERE, 'exam-dist.tar.gz')


def build_tar():
    if os.path.exists(TAR):
        os.remove(TAR)
    with tarfile.open(TAR, 'w:gz', compresslevel=6) as tf:
        for name in ('index.json',):
            tf.add(os.path.join(DIST, name), arcname=name)
        for sub in ('papers', 'pools', 'essay', 'img'):
            base = os.path.join(DIST, sub)
            if not os.path.isdir(base):
                continue
            for root, _dirs, files in os.walk(base):
                for fn in files:
                    full = os.path.join(root, fn)
                    tf.add(full, arcname=os.path.relpath(full, DIST))
    return os.path.getsize(TAR)


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    size = build_tar()
    print('打包 %.2f MB -> %s' % (size / 1048576.0, TAR))

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASS, timeout=30, banner_timeout=30)

    sftp = client.open_sftp()
    for p in ('/home/point/couple/uploads', REMOTE):
        try:
            sftp.stat(p)
        except IOError:
            sftp.mkdir(p)
    sftp.put(TAR, '/tmp/exam-dist.tar.gz')
    sftp.close()

    cmd = (
        "cd %s && tar xzf /tmp/exam-dist.tar.gz && "
        "echo '--- files ---' && "
        "du -sh . && find . -type f | wc -l && "
        "echo -n 'index:  '; curl -s -o /dev/null -w '%%{http_code}\\n' http://127.0.0.1:5011/couple-api/files/exam/index.json; "
        "echo -n 'paper:  '; curl -s -o /dev/null -w '%%{http_code}\\n' http://127.0.0.1:5011/couple-api/files/exam/papers/gk2025-zf.json; "
        "echo -n 'pool:   '; curl -s -o /dev/null -w '%%{http_code}\\n' http://127.0.0.1:5011/couple-api/files/exam/pools/tuxing.json; "
        "echo -n 'image:  '; curl -s -o /dev/null -w '%%{http_code}\\n' http://127.0.0.1:5011/couple-api/files/exam/img/gk2025-fsx/1938224b3d16736.webp; "
        "echo -n 'public: '; curl -s -o /dev/null -w '%%{http_code}\\n' https://hhxpoint.me/couple-api/files/exam/index.json; "
        "echo -n 'api-index-papers: '; curl -s https://hhxpoint.me/couple-api/files/exam/index.json | head -c 160; echo"
    ) % REMOTE
    stdin, stdout, stderr = client.exec_command(cmd, timeout=180)
    print(stdout.read().decode('utf-8', 'replace'))
    err = stderr.read().decode('utf-8', 'replace')
    if err.strip():
        print('[stderr]', err[:400])
    client.close()


if __name__ == '__main__':
    main()
