-- =============================================
-- 신우씨링 ERP 1차 검수 수정 - DB Migration
-- 실행일: 2026-04-01
-- 실행 대상: 운영 서버 MariaDB
-- 실행 방법: mysql -u root -p shinwoo_erp < prisma/migrations/20260331_step1_fixes.sql
-- =============================================

-- [Item 10] 거래처 구분 추가
ALTER TABLE clients ADD COLUMN client_type VARCHAR(10) NOT NULL DEFAULT '매출' AFTER company_name;
CREATE INDEX idx_clients_client_type ON clients(client_type);

-- [Item 11] 견적 담당자 테이블
CREATE TABLE estimate_managers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  title VARCHAR(50) NULL,
  phone VARCHAR(30) NULL,
  email VARCHAR(100) NULL,
  is_default TINYINT(1) NOT NULL DEFAULT 0,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO estimate_managers (name, title, phone, email, is_default, sort_order)
VALUES ('박성진', '실장', '010-3583-6312', 'shinwoo6536@hanmail.net', 1, 0);

-- [Item 11] estimates 테이블에 담당자 스냅샷
ALTER TABLE estimates ADD COLUMN manager_id INT NULL AFTER recipient_text;
ALTER TABLE estimates ADD COLUMN manager_name VARCHAR(50) NULL AFTER manager_id;
ALTER TABLE estimates ADD COLUMN manager_title VARCHAR(50) NULL AFTER manager_name;
ALTER TABLE estimates ADD COLUMN manager_phone VARCHAR(30) NULL AFTER manager_title;
ALTER TABLE estimates ADD COLUMN manager_email VARCHAR(100) NULL AFTER manager_phone;

UPDATE estimates SET
  manager_id = 1,
  manager_name = '박성진',
  manager_title = '실장',
  manager_phone = '010-3583-6312',
  manager_email = 'shinwoo6536@hanmail.net';

-- [Item 12] 비밀번호 변경 기능
ALTER TABLE company_info ADD COLUMN password_hash VARCHAR(200) NULL;

-- [Item 1] 거래처에 대표자명 필드 추가
ALTER TABLE clients ADD COLUMN representative VARCHAR(50) NULL AFTER client_type;
