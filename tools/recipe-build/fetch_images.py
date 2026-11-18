import base64
import os
import shutil

import paramiko

HOST = os.environ.get('POINT_HOST', '20.98.97.86')
USER = os.environ.get('POINT_USER', 'point')
PASS = os.environ['POINT_PASS']
ROOT = r'D:\03-Projects\answer'
DATA = os.path.join(ROOT, 'packageRecipe', 'data', 'recipes.js')
JS = os.path.join(ROOT, 'tools', 'recipe-build', 'fetch_images_server.js')
OUT = os.path.join(ROOT, 'packageRecipe', 'assets', 'recipes')
TAR_LOCAL = r'D:\dsh\workplace\recipe_assets.tar.gz'


def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASS, timeout=25, banner_timeout=25)
    sftp = client.open_sftp()
    sftp.put(DATA, '/home/point/couple/recipe_data.js')
    sftp.put(JS, '/home/point/couple/fetch_images_server.js')
    sftp.close()

    cmd = 'cd /home/point/couple && node fetch_images_server.js 2>&1; ls -lh /tmp/recipe_assets.tar.gz'
    stdin, stdout, stderr = client.exec_command(cmd, timeout=600)
    out = stdout.read().decode('utf-8', 'replace')
    err = stderr.read().decode('utf-8', 'replace')
    print(out[-12000:])
    if err.strip():
        print('STDERR:', err[-3000:])

    sftp = client.open_sftp()
    sftp.get('/tmp/recipe_assets.tar.gz', TAR_LOCAL)
    sftp.get('/tmp/recipe_assets/credits.json', os.path.join(ROOT, 'tools', 'recipe-build', 'credits.json'))
    sftp.close()
    client.exec_command('rm -f /tmp/recipe_assets.tar.gz; rm -rf /tmp/recipe_assets /tmp/recipe_assets_raw /home/point/couple/recipe_data.js /home/point/couple/fetch_images_server.js')
    client.close()
    print('downloaded', TAR_LOCAL)


if __name__ == '__main__':
    main()
