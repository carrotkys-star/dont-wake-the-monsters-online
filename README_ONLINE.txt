DON'T WAKE THE MONSTERS - MULTIPLAYER

ไฟล์ในชุดนี้มี 4 ไฟล์:
1. DONT_WAKE_THE_MONSTERS_ONLINE.html  = ตัวเกม
2. server.js                            = Server Multiplayer
3. package.json                         = รายการโปรแกรมที่ Server ต้องใช้
4. README_ONLINE.txt                    = คู่มือ

วิธีติดตั้ง
1. ติดตั้ง Node.js ก่อน
2. วางไฟล์ทั้ง 4 ไฟล์ไว้ในโฟลเดอร์เดียวกัน
3. เปิด CMD ในโฟลเดอร์นั้น
4. พิมพ์:
   npm install
5. รอจนติดตั้งเสร็จ แล้วพิมพ์:
   npm start
6. เปิด Chrome/Edge แล้วเข้า:
   http://localhost:3000/DONT_WAKE_THE_MONSTERS_ONLINE.html

วิธีเล่นกับเพื่อนใน Wi-Fi เดียวกัน
1. เครื่อง Host เปิด server ด้วย npm start
2. ใน CMD พิมพ์:
   ipconfig
3. ดู IPv4 Address ของ Wi-Fi เช่น 192.168.1.10
4. เพื่อนเปิด:
   http://192.168.1.10:3000/DONT_WAKE_THE_MONSTERS_ONLINE.html
   (เปลี่ยน IP ให้เป็นของเครื่อง Host)
5. Host กด "เล่นออนไลน์กับเพื่อน" -> ใส่ชื่อ -> "สร้างห้อง"
6. ส่งรหัส 6 ตัวให้เพื่อน
7. เพื่อนใส่ชื่อ -> กด "เข้าห้อง" -> ใส่รหัส -> เข้าห้อง
8. เมื่อมีอย่างน้อย 2 คน Host จะกด "เริ่มเกม"

หมายเหตุ
- ห้องรองรับสูงสุด 4 คน
- ผู้เล่นคนอื่นจะแสดงในเกมและตำแหน่งอัปเดตแบบ real-time
- ต้องเปิด server (npm start) ค้างไว้ระหว่างเล่น
- อย่าเปิดไฟล์ HTML ด้วยการดับเบิลคลิกแบบ file:// ให้เปิดผ่าน http://localhost:3000/...
- ถ้า Windows Firewall ถาม ให้อนุญาต Node.js บนเครือข่าย Private เพื่อให้เพื่อนใน Wi-Fi เดียวกันเชื่อมต่อได้
