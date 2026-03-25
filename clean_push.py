import os
import shutil
import subprocess

def clean_and_push():
    paths_to_delete = [
        '.git',
        'mcd-frontend/node_modules',
        'mcd-backend/venv_mcd',
        'mcd-backend/venv'
    ]
    
    for path in paths_to_delete:
        if os.path.exists(path):
            print(f"🗑️ Deleting {path}...")
            try:
                shutil.rmtree(path, ignore_errors=True)
            except Exception as e:
                print(f"❌ Failed to delete {path}: {e}")

    print("🚀 Initializing fresh repository...")
    subprocess.run(["git", "init"], check=True)
    subprocess.run(["git", "remote", "add", "origin", "https://github.com/Khushi281300/innovates.git"], check=True)
    subprocess.run(["git", "branch", "-M", "main"], check=True)
    
    print("📝 Staging surgical files...")
    subprocess.run(["git", "add", "."], check=True)
    subprocess.run(["git", "commit", "-m", "feat: stable hackathon launch v1.0"], check=True)
    
    print("📤 Pushing to GitHub...")
    subprocess.run(["git", "push", "origin", "main", "--force"], check=True)
    print("✅ MISSION SUCCESSFUL")

if __name__ == "__main__":
    clean_and_push()
