# -*- coding: utf-8 -*-
"""只部署申论数据（essay/）——避免整包 26MB 重传。"""
import os
import sys
import tarfile

import paramiko

HOST = '20.98.97.86'
USER = 'point'
PASS = os.environ['POINT_PASS']
REMOTE = '/home/point/couple/uploads/exam'
HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, 'dist')
TAR = os.path.join(HERE, 'essay-only.tar.gz')


def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    with tarfile.open(TAR, 'w:gz') as tf:
        base = os.path.join(DIST, 'essay')
        for fn in sorted(os.listdir(base)):
            tf.add(os.path.join(base, fn), arcname='essay/' + fn)
    size = os.path.getsize(TAR)
    print('打包 essay %.2f MB' % (size / 1048576.0))

    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    c.connect(HOST, username=USER, password=PASS, timeout=25, banner_timeout=25)
    sftp = c.open_sftp()
    sftp.put(TAR, '/tmp/essay-only.tar.gz')
    sftp.close()

    cmd = ('cd %s && tar xzf /tmp/essay-only.tar.gz && ls essay | wc -l && '
           'curl -s https://hhxpoint.me/couple-api/files/exam/essay/sl2025-fsx.json | head -c 120; echo' % REMOTE)
    _in, out, err = c.exec_command(cmd, timeout=120)
    print(out.read().decode('utf-8', 'replace'))
    e = err.read().decode('utf-8', 'replace')
    if e.strip():
        print('[stderr]', e[:200])
    c.close()


if __name__ == '__main__':
    main()
