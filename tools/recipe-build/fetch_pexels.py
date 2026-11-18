import os
import paramiko

HOST = os.environ.get('POINT_HOST', '20.98.97.86')
USER = os.environ.get('POINT_USER', 'point')
PASS = os.environ['POINT_PASS']
ROOT = r'D:\03-Projects\answer'
DATA = os.path.join(ROOT, 'packageRecipe', 'data', 'recipes.js')
JS = os.path.join(ROOT, 'tools', 'recipe-build', 'fetch_pexels.js')
TAR_LOCAL = r'D:\dsh\workplace\pexels_imgs.tar.gz'
REPORT_LOCAL = os.path.join(ROOT, 'tools', 'recipe-build', 'pexels_report.json')


def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASS, timeout=25, banner_timeout=25)
    client.get_transport().set_keepalive(20)
    sftp = client.open_sftp()
    sftp.put(DATA, '/home/point/couple/recipe_data.js')
    sftp.put(JS, '/home/point/couple/fetch_pexels.js')
    sftp.close()
    cmd = ('cd /home/point/couple && rm -rf /tmp/pexels_imgs /tmp/pexels_imgs_raw /tmp/pexels_imgs.tar.gz && '
           'node fetch_pexels.js 2>&1; echo "EXIT:$?"; ls -lh /tmp/pexels_imgs.tar.gz 2>/dev/null')
    stdin, stdout, stderr = client.exec_command(cmd, timeout=900)
    out = stdout.read().decode('utf-8', 'replace')
    err = stderr.read().decode('utf-8', 'replace')
    print(out[-15000:])
    if err.strip():
        print('STDERR:', err[-3000:])
    sftp = client.open_sftp()
    try:
        sftp.get('/tmp/pexels_imgs.tar.gz', TAR_LOCAL)
        sftp.get('/tmp/pexels_imgs/report.json', REPORT_LOCAL)
        print('downloaded')
    except Exception as exc:
        print('download failed', exc)
    sftp.close()
    client.exec_command('rm -f /tmp/pexels_imgs.tar.gz; rm -rf /tmp/pexels_imgs /tmp/pexels_imgs_raw /home/point/couple/recipe_data.js /home/point/couple/fetch_pexels.js')
    client.close()


if __name__ == '__main__':
    main()
