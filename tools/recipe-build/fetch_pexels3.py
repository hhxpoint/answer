import os
import paramiko
HOST = os.environ.get('POINT_HOST', '20.98.97.86')
USER = os.environ.get('POINT_USER', 'point')
PASS = os.environ['POINT_PASS']
ROOT = r'D:\03-Projects\answer'
JS = os.path.join(ROOT, 'tools', 'recipe-build', 'fetch_pexels3.js')
TAR = r'D:\dsh\workplace\pexels3.tar.gz'
REPORT = os.path.join(ROOT, 'tools', 'recipe-build', 'pexels3_report.json')

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, username=USER, password=PASS, timeout=25, banner_timeout=25)
client.get_transport().set_keepalive(20)
sftp = client.open_sftp(); sftp.put(JS, '/home/point/couple/fetch_pexels3.js'); sftp.close()
cmd = 'cd /home/point/couple && rm -rf /tmp/pexels3 /tmp/pexels3_raw /tmp/pexels3.tar.gz && node fetch_pexels3.js 2>&1; echo EXIT:$?; ls -lh /tmp/pexels3.tar.gz'
stdin, stdout, stderr = client.exec_command(cmd, timeout=600)
out = stdout.read().decode('utf-8', 'replace'); err = stderr.read().decode('utf-8', 'replace')
print(out[-12000:])
if err.strip(): print('STDERR', err[-2000:])
sftp = client.open_sftp()
try:
    sftp.get('/tmp/pexels3.tar.gz', TAR); sftp.get('/tmp/pexels3/report.json', REPORT); print('downloaded')
except Exception as e: print('download failed', e)
sftp.close(); client.exec_command('rm -f /tmp/pexels3.tar.gz; rm -rf /tmp/pexels3 /tmp/pexels3_raw /home/point/couple/fetch_pexels3.js'); client.close()
