# -*- coding: utf-8 -*-
"""把 dist 里的题库资源部署到服务器静态目录。

远端：/home/point/couple/uploads/exam/
访问：https://hhxpoint.me/couple-api/files/exam/...

用法：set POINT_PASS=... && python deploy_exam.py
"""
import os
import sys
import time

import paramiko

HOST = os.environ.get('POINT_HOST', '20.98.97.86')
USER = os.environ.get('POINT_USER', 'point')
PASS = os.environ['POINT_PASS']

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, 'dist')
REMOTE = '/home/point/couple/uploads/exam'


def ensure_dir(sftp, path):
    parts = path.strip('/').split('/')
    cur = ''
    for p in parts:
        cur += '/' + p
        try:
            sftp.stat(cur)
        except IOError:
            sftp.mkdir(cur)


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASS, timeout=25, banner_timeout=25)
    sftp = client.open_sftp()

    ensure_dir(sftp, REMOTE)
    ensure_dir(sftp, REMOTE + '/papers')

    uploaded = 0
    bytes_up = 0

    # index
    src = os.path.join(DIST, 'index.json')
    sftp.put(src, REMOTE + '/index.json')
    uploaded += 1
    bytes_up += os.path.getsize(src)
    print('  index.json')

    # papers
    pdir = os.path.join(DIST, 'papers')
    for fn in sorted(os.listdir(pdir)):
        if not fn.endswith('.json'):
            continue
        sftp.put(os.path.join(pdir, fn), REMOTE + '/papers/' + fn)
        uploaded += 1
        bytes_up += os.path.getsize(os.path.join(pdir, fn))
        print('  papers/' + fn)

    # images
    idir = os.path.join(DIST, 'img')
    for key in sorted(os.listdir(idir)):
        kdir = os.path.join(idir, key)
        if not os.path.isdir(kdir):
            continue
        ensure_dir(sftp, REMOTE + '/img/' + key)
        files = sorted(os.listdir(kdir))
        for i, fn in enumerate(files, 1):
            local = os.path.join(kdir, fn)
            sftp.put(local, REMOTE + '/img/' + key + '/' + fn)
            uploaded += 1
            bytes_up += os.path.getsize(local)
        print('  img/%s  %d 张' % (key, len(files)))

    sftp.close()

    # 验证
    cmd = (
        "echo -n 'index:   '; curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:5011/couple-api/files/exam/index.json; "
        "echo -n 'paper:   '; curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:5011/couple-api/files/exam/papers/gk2025-fsx.json; "
        "echo -n 'image:   '; curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:5011/couple-api/files/exam/img/gk2025-fsx/1938224b3d16736.webp; "
        "echo -n 'public:  '; curl -s -o /dev/null -w '%{http_code}\\n' https://hhxpoint.me/couple-api/files/exam/index.json; "
        "du -sh /home/point/couple/uploads/exam"
    )
    stdin, stdout, stderr = client.exec_command(cmd, timeout=90)
    print(stdout.read().decode('utf-8', 'replace'))
    err = stderr.read().decode('utf-8', 'replace')
    if err.strip():
        print('[stderr]', err[:400])

    print('上传 %d 个文件，%.2f MB' % (uploaded, bytes_up / 1048576.0))
    client.close()


if __name__ == '__main__':
    main()
