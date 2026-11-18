import os
import paramiko

HOST = os.environ.get('POINT_HOST', '20.98.97.86')
USER = os.environ.get('POINT_USER', 'point')
PASS = os.environ['POINT_PASS']
ROOT = r'D:\03-Projects\answer'
DATA = os.path.join(ROOT, 'packageRecipe', 'data', 'recipes.js')
JS = os.path.join(ROOT, 'tools', 'recipe-build', 'fetch_images_wiki.js')
TAR_LOCAL = r'D:\dsh\workplace\recipe_assets.tar.gz'
CREDITS_LOCAL = os.path.join(ROOT, 'tools', 'recipe-build', 'credits.json')


def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASS, timeout=25, banner_timeout=25)
    transport = client.get_transport()
    transport.set_keepalive(20)
    sftp = client.open_sftp()
    sftp.put(DATA, '/home/point/couple/recipe_data.js')
    sftp.put(JS, '/home/point/couple/fetch_images_wiki.js')
    sftp.close()

    cmd = ('cd /home/point/couple && rm -rf /tmp/recipe_assets /tmp/recipe_assets_raw /tmp/recipe_assets.tar.gz && '
           'node fetch_images_wiki.js 2>&1; echo "EXIT:$?"; ls -lh /tmp/recipe_assets.tar.gz 2>/dev/null')
    stdin, stdout, stderr = client.exec_command(cmd, timeout=900)
    out = stdout.read().decode('utf-8', 'replace')
    err = stderr.read().decode('utf-8', 'replace')
    print(out[-14000:])
    if err.strip():
        print('STDERR:', err[-3000:])

    sftp = client.open_sftp()
    try:
        sftp.get('/tmp/recipe_assets.tar.gz', TAR_LOCAL)
        print('downloaded', TAR_LOCAL)
    except Exception as exc:
        print('tar download failed', exc)
    try:
        sftp.get('/tmp/recipe_assets/credits.json', CREDITS_LOCAL)
        print('downloaded credits')
    except Exception as exc:
        print('credits download failed', exc)
    sftp.close()
    client.exec_command('rm -f /tmp/recipe_assets.tar.gz; rm -rf /tmp/recipe_assets /tmp/recipe_assets_raw /home/point/couple/recipe_data.js /home/point/couple/fetch_images_wiki.js')
    client.close()


if __name__ == '__main__':
    main()
