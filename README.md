# ANIME FREE - GitHub Pages Ready

## วิธีอัพขึ้น GitHub

1. สร้าง repo ใหม่บน GitHub
2. อัพโหลดไฟล์ทั้งหมดในโฟลเดอร์นี้
   ```bash
   git init
   git add .
   git commit -m "initial"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```
3. ไปที่ Settings > Pages > Source: Deploy from a branch, Branch: main, Folder: /docs
4. รอ 1-2 นาที เปิด https://USERNAME.github.io/REPO/

## Auto Sync
- GitHub Actions จะรันทุก 3 ชม. ดึง https://animemaji.com/feed/ แล้วอัพเดท docs/api/latest.json อัตโนมัติ

ลบคำว่า animemajiclean ออกหมดแล้ว ใช้ ANIME FREE
