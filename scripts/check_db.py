import urllib.request
import json

base_url = 'http://supabasekong-k7v0e6lnxjwerisif54rzczl.187.77.131.65.sslip.io'
service_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4MjAzOTkwMCwiZXhwIjo0OTM3NzEzNTAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.DrdZTVKHvVSgJsJWciIIOyq91lJodQAzUTZ8FCTV7h4'

def query_sql(sql):
    req = urllib.request.Request(
        f'{base_url}/pg/query',
        data=json.dumps({'query': sql}).encode('utf-8'),
        headers={'apikey': service_key, 'Authorization': f'Bearer {service_key}', 'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode('utf-8'))

print("=== TABLES IN PUBLIC SCHEMA ===")
tables = query_sql("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;")
print(json.dumps(tables, indent=2))

print("\n=== STORAGE BUCKETS ===")
try:
    buckets = query_sql("SELECT id, name, public FROM storage.buckets;")
    print(json.dumps(buckets, indent=2))
except Exception as e:
    print("Storage buckets query error:", e)

print("\n=== APP_LANDING_PAGES COLUMNS ===")
columns = query_sql("SELECT column_name, data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'app_landing_pages';")
print(json.dumps(columns, indent=2))
