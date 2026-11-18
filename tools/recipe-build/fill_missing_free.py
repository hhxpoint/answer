import os
import paramiko

HOST = os.environ.get('POINT_HOST', '20.98.97.86')
USER = os.environ.get('POINT_USER', 'point')
PASS = os.environ['POINT_PASS']
ROOT = r'D:\03-Projects\answer'
DATA = os.path.join(ROOT, 'packageRecipe', 'data', 'recipes.js')
JS = os.path.join(ROOT, 'tools', 'recipe-build', 'fill_missing_free.js')
TAR_LOCAL = r'D:\dsh\workplace\recipe_fill.tar.gz'
REPORT_LOCAL = os.path.join(ROOT, 'tools', 'recipe-build', 'fill_report.json')


def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASS, timeout=25, banner_timeout=25)
    client.get_transport().set_keepalive(20)
    sftp = client.open_sftp()
    sftp.put(DATA, '/home/point/couple/recipe_data.js')
    sftp.put(JS, '/home/point/couple/fill_missing_free.js')
    sftp.close()
    cmd = ('cd /home/point/couple && rm -rf /tmp/recipe_fill /tmp/recipe_fill_raw /tmp/recipe_fill.tar.gz && '
           'node fill_missing_free.js 2>&1; echo "EXIT:$?"; ls -lh /tmp/recipe_fill.tar.gz 2>/dev/null')
    stdin, stdout, stderr = client.exec_command(cmd, timeout=900)
    out = stdout.read().decode('utf-8', 'replace')
    err = stderr.read().decode('utf-8', 'replace')
    print(out[-12000:])
    if err.strip():
        print('STDERR:', err[-2000:])
    sftp = client.open_sftp()
    try:
        sftp.get('/tmp/recipe_fill.tar.gz', TAR_LOCAL)
        sftp.get('/tmp/recipe_fill/report.json', REPORT_LOCAL)
        print('downloaded')
    except Exception as exc:
        print('download failed', exc)
    sftp.close()
    client.exec_command('rm -f /tmp/recipe_fill.tar.gz; rm -rf /tmp/recipe_fill /tmp/recipe_fill_raw /home/point/couple/recipe_data.js /home/point/couple/fill_missing_free.js')
    client.close()


if __name__ == '__main__':
    main()
