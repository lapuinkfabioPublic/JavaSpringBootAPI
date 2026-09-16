import os
import boto3
from botocore import UNSIGNED
from botocore.config import Config
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

BUCKET = "evertecinc-com-assets"
DEST   = "./evertecinc-com-assets"
PUBLIC = True   # True se o bucket for público; False se usar credenciais
WORKERS = 16

# Cliente
if PUBLIC:
    s3 = boto3.client("s3", config=Config(signature_version=UNSIGNED))
else:
    s3 = boto3.client("s3")  # usa ~/.aws/credentials

lock = threading.Lock()
count = 0

def baixar(key: str, size: int):
    global count
    local_path = os.path.join(DEST, key)
    os.makedirs(os.path.dirname(local_path), exist_ok=True)

    # Pula se já existe com mesmo tamanho
    if os.path.exists(local_path) and os.path.getsize(local_path) == size:
        return f"[SKIP] {key}"

    try:
        s3.download_file(BUCKET, key, local_path)
        with lock:
            count += 1
        return f"[OK]   {key} ({size} bytes)"
    except Exception as e:
        return f"[ERRO] {key}: {e}"

def listar_tudo():
    paginator = s3.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=BUCKET):
        for obj in page.get("Contents", []):
            yield obj["Key"], obj["Size"]

def main():
    os.makedirs(DEST, exist_ok=True)
    print(f"📦 Espelhando s3://{BUCKET} → {DEST}\n")

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = [pool.submit(baixar, k, s) for k, s in listar_tudo()]
        for f in as_completed(futures):
            print(f.result())

    print(f"\n✅ Concluído. {count} arquivos baixados.")

if __name__ == "__main__":
    main()