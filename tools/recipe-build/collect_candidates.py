import os
import paramiko

HOST = os.environ.get('POINT_HOST', '20.98.97.86')
USER = os.environ.get('POINT_USER', 'point')
PASS = os.environ['POINT_PASS']
ROOT = r'D:\03-Projects\answer'
FILES = {
    'packageRecipe/data/recipes.js': '/home/point/couple/recipe_data.js',
    'tools/recipe-build/image_queries.json': '/home/point/couple/image_queries.json',
    'tools/recipe-build/collect_candidates.js': '/home/point/couple/collect_candidates.js',
}
TAR_LOCAL = r'D:\dsh\workplace\recipe_candidates.tar.gz'
REPORT_LOCAL = os.path.join(ROOT, 'tools', 'recipe-build', 'candidates_report.json')


def main():
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=PASS, timeout=25, banner_timeout=25)
    client.get_transport().set_keepalive(20)
    sftp = client.open_sftp()
    for src, dst in FILES.items():
        sftp.put(os.path.join(ROOT, src), dst)
    sftp.close()

    cmd = ('cd /home/point/couple && rm -rf /tmp/recipe_candidates /tmp/recipe_candidates_raw /tmp/recipe_candidates.tar.gz && '
           'node collect_candidates.js 2>&1; echo "EXIT:$?"; ls -lh /tmp/recipe_candidates.tar.gz 2>/dev/null')
    stdin, stdout, stderr = client.exec_command(cmd, timeout=900)
    out = stdout.read().decode('utf-8', 'replace')
    err = stderr.read().decode('utf-8', 'replace')
    print(out[-16000:])
    if err.strip():
        print('STDERR:', err[-3000:])

    sftp = client.open_sftp()
    try:
        sftp.get('/tmp/recipe_candidates.tar.gz', TAR_LOCAL)
        sftp.get('/tmp/recipe_candidates/report.json', REPORT_LOCAL)
        print('downloaded tar + report')
    except Exception as exc:
        print('download failed', exc)
    sftp.close()
    client.exec_command('rm -f /tmp/recipe_candidates.tar.gz; rm -rf /tmp/recipe_candidates /tmp/recipe_candidates_raw; rm -f /home/point/couple/collect_candidates.js /home/point/couple/image_queries.json /home/point/couple/recipe_data.js')
    client.close()


if __name__ == '__main__':
    main()
