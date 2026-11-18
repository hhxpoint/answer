import os
import paramiko

HOST = os.environ.get('POINT_HOST', '20.98.97.86')
USER = os.environ.get('POINT_USER', 'point')
PASS = os.environ['POINT_PASS']
ROOT = r'D:\03-Projects\answer'
JS = os.path.join(ROOT, 'tools', 'recipe-build', 'collect_openverse.js')
TAR_LOCAL = r'D:\dsh\workplace\recipe_ov.tar.gz'
REPORT_LOCAL = os.path.join(ROOT, 'tools', 'recipe-build', 'openverse_report.json')


def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASS, timeout=25, banner_timeout=25)
    client.get_transport().set_keepalive(20)
    sftp = client.open_sftp()
    sftp.put(JS, '/home/point/couple/collect_openverse.js')
    sftp.close()
    cmd = ('cd /home/point/couple && rm -rf /tmp/recipe_ov /tmp/recipe_ov_raw /tmp/recipe_ov.tar.gz && '
           'node collect_openverse.js 2>&1; echo "EXIT:$?"; ls -lh /tmp/recipe_ov.tar.gz 2>/dev/null')
    stdin, stdout, stderr = client.exec_command(cmd, timeout=600)
    out = stdout.read().decode('utf-8', 'replace')
    err = stderr.read().decode('utf-8', 'replace')
    print(out[-12000:])
    if err.strip():
        print('STDERR:', err[-2000:])
    sftp = client.open_sftp()
    try:
        sftp.get('/tmp/recipe_ov.tar.gz', TAR_LOCAL)
        sftp.get('/tmp/recipe_ov/report.json', REPORT_LOCAL)
        print('downloaded')
    except Exception as exc:
        print('download failed', exc)
    sftp.close()
    client.exec_command('rm -f /tmp/recipe_ov.tar.gz; rm -rf /tmp/recipe_ov /tmp/recipe_ov_raw /home/point/couple/collect_openverse.js')
    client.close()


if __name__ == '__main__':
    main()
