-- Seed default contract templates
-- Note: Default templates use NULL user_id and are visible to all users via RLS policy

-- Allow NULL user_id for system templates (alter existing table)
ALTER TABLE public.contract_templates ALTER COLUMN user_id DROP NOT NULL;

-- Temporarily disable RLS to insert system templates
ALTER TABLE public.contract_templates DISABLE ROW LEVEL SECURITY;

-- Standard Residential Lease Template
INSERT INTO public.contract_templates (id, user_id, name, content, variables, is_default)
VALUES (
  gen_random_uuid(),
  NULL,
  'Hợp đồng thuê nhà dân dụng (Chuẩn)',
  'HỢP ĐỒNG THUÊ NHÀ DÂN DỤNG

Hôm nay, ngày {{contract_date}}, tại {{property_address}}, chúng tôi gồm có:

BÊN CHO THUÊ (Bên A):
Ông/Bà: {{landlord_name}}
CCCD số: {{landlord_id_card}}
Số điện thoại: {{landlord_phone}}
Là chủ sở hữu hợp pháp của địa chỉ cho thuê.

BÊN THUÊ (Bên B):
Ông/Bà: {{tenant_full_name}}
CCCD số: {{tenant_id_card}}
Số điện thoại: {{tenant_phone}}
Email: {{tenant_email}}
Địa chỉ hiện tại: {{tenant_current_address}}

Hai bên thỏa thuận ký kết hợp đồng với các điều khoản sau:

ĐIỀU 1: ĐỐI TƯỢNG CỦA HỢP ĐỒNG
Bên A đồng ý cho Bên B thuê nhà tại địa chỉ: {{property_address}}

ĐIỀU 2: THỜI HẠN THUÊ
- Thời hạn thuê: Từ ngày {{start_date}} đến ngày {{end_date}}
- Hợp đồng có hiệu lực kể từ ngày {{contract_date}}

ĐIỀU 3: GIÁ THUÊ VÀ PHƯƠNG THỨC THANH TOÁN
- Giá thuê: {{monthly_rent}} VNĐ/tháng
- Tiền đặt cọc: {{deposit}} VNĐ
- Phương thức thanh toán: Chuyển khoản hoặc tiền mặt
- Thời hạn thanh toán: Trước ngày {{payment_date}} hàng tháng
- Tiền điện, nước, internet: Bên B thanh toán theo thực tế sử dụng

ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ CỦA BÊN CHO THUÊ
- Giao nhà và trang thiết bị (nếu có) cho Bên B đúng hạn
- Đảm bảo Bên B sử dụng ổn định nhà trong thời gian thuê
- Tạo điều kiện để Bên B sử dụng đầy đủ các dịch vụ

ĐIỀU 5: QUYỀN VÀ NGHĨA VỤ CỦA BÊN THUÊ
- Thanh toán đầy đủ và đúng hạn tiền thuê theo thỏa thuận
- Giữ gìn nhà cửa, trang thiết bị của Bên A
- Chấp hành đầy đủ các quy định của pháp luật, khu vực
- Không được chuyển nhượng, cho thuê lại khi chưa có sự đồng ý của Bên A

ĐIỀU 6: ĐIỀU KHOẢN CHUNG
- Hai bên cam kết thực hiện đúng các điều khoản đã thỏa thuận
- Mọi tranh chấp phát sinh sẽ được giải quyết trên tinh thần hòa giải
- Hợp đồng được lập thành 02 bản, mỗi bên giữ 01 bản có giá trị pháp lý như nhau

Hợp đồng có hiệu lực kể từ ngày ký.


BÊN CHO THUÊ                                BÊN THUÊ
(Ký và ghi rõ họ tên)                        (Ký và ghi rõ họ tên)',
  '[
    {"key": "contract_date", "label": "Ngày ký hợp đồng", "type": "date", "required": true},
    {"key": "property_address", "label": "Địa chỉ bất động sản", "type": "text", "required": true},
    {"key": "landlord_name", "label": "Tên chủ nhà", "type": "text", "required": true},
    {"key": "landlord_id_card", "label": "Số CCCD chủ nhà", "type": "text", "required": true},
    {"key": "landlord_phone", "label": "Số điện thoại chủ nhà", "type": "text", "required": true},
    {"key": "tenant_full_name", "label": "Tên đầy đủ người thuê", "type": "text", "required": true},
    {"key": "tenant_id_card", "label": "Số CCCD người thuê", "type": "text", "required": true},
    {"key": "tenant_phone", "label": "Số điện thoại người thuê", "type": "text", "required": true},
    {"key": "tenant_email", "label": "Email người thuê", "type": "text", "required": false},
    {"key": "tenant_current_address", "label": "Địa chỉ hiện tại người thuê", "type": "text", "required": true},
    {"key": "start_date", "label": "Ngày bắt đầu", "type": "date", "required": true},
    {"key": "end_date", "label": "Ngày kết thúc", "type": "date", "required": true},
    {"key": "monthly_rent", "label": "Tiền thuê hàng tháng", "type": "currency", "required": true},
    {"key": "deposit", "label": "Tiền đặt cọc", "type": "currency", "required": true},
    {"key": "payment_date", "label": "Ngày thanh toán", "type": "number", "required": true}
  ]'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Commercial Property Lease Template
INSERT INTO public.contract_templates (id, user_id, name, content, variables, is_default)
VALUES (
  gen_random_uuid(),
  NULL,
  'Hợp đồng thuê nhà kinh doanh thương mại',
  'HỢP ĐỒNG THUÊ NHÀ KINH DOANH THƯƠNG MẠI

Hôm nay, ngày {{contract_date}}, tại {{property_address}}, chúng tôi gồm có:

BÊN CHO THUÊ (Bên A):
Ông/Bà: {{landlord_name}}
CCCD số: {{landlord_id_card}}
Số điện thoại: {{landlord_phone}}

BÊN THUÊ (Bên B):
Công ty/Cá nhân: {{tenant_full_name}}
Mã số thuế/CCCD: {{tenant_id_card}}
Số điện thoại: {{tenant_phone}}
Email: {{tenant_email}}

ĐIỀU 1: ĐỐI TƯỢNG HỢP ĐỒNG
Bên A cho Bên B thuê mặt bằng kinh doanh tại: {{property_address}}
Diện tích: ______ m²
Mục đích sử dụng: Kinh doanh thương mại

ĐIỀU 2: THỜI HẠN
Từ ngày {{start_date}} đến ngày {{end_date}}

ĐIỀU 3: GIÁ THUÊ
- Giá thuê: {{monthly_rent}} VNĐ/tháng
- Tiền đặt cọc: {{deposit}} VNĐ
- Thanh toán: Trước ngày {{payment_date}} hàng tháng
- Chi phí điện, nước, dịch vụ: Bên B thanh toán theo thực tế

ĐIỀU 4: QUYỀN VÀ NGHĨA VỤ
Bên A:
- Giao mặt bằng đúng hạn, đảm bảo pháp lý
- Hỗ trợ Bên B trong việc đăng ký kinh doanh (nếu cần)

Bên B:
- Thanh toán đầy đủ, đúng hạn
- Chấp hành quy định về PCCC, ATVSLĐ
- Không được chuyển nhượng quyền thuê khi chưa có sự đồng ý

ĐIỀU 5: ĐIỀU KHOẢN CHUNG
Hợp đồng lập thành 02 bản có giá trị pháp lý như nhau.


BÊN CHO THUÊ                                BÊN THUÊ
(Ký và ghi rõ họ tên)                        (Ký, đóng dấu)',
  '[
    {"key": "contract_date", "label": "Ngày ký hợp đồng", "type": "date", "required": true},
    {"key": "property_address", "label": "Địa chỉ bất động sản", "type": "text", "required": true},
    {"key": "landlord_name", "label": "Tên chủ nhà", "type": "text", "required": true},
    {"key": "landlord_id_card", "label": "Số CCCD chủ nhà", "type": "text", "required": true},
    {"key": "landlord_phone", "label": "Số điện thoại chủ nhà", "type": "text", "required": true},
    {"key": "tenant_full_name", "label": "Tên công ty/cá nhân thuê", "type": "text", "required": true},
    {"key": "tenant_id_card", "label": "Mã số thuế/CCCD", "type": "text", "required": true},
    {"key": "tenant_phone", "label": "Số điện thoại", "type": "text", "required": true},
    {"key": "tenant_email", "label": "Email", "type": "text", "required": false},
    {"key": "start_date", "label": "Ngày bắt đầu", "type": "date", "required": true},
    {"key": "end_date", "label": "Ngày kết thúc", "type": "date", "required": true},
    {"key": "monthly_rent", "label": "Tiền thuê hàng tháng", "type": "currency", "required": true},
    {"key": "deposit", "label": "Tiền đặt cọc", "type": "currency", "required": true},
    {"key": "payment_date", "label": "Ngày thanh toán", "type": "number", "required": true}
  ]'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Short-term Rental Agreement Template
INSERT INTO public.contract_templates (id, user_id, name, content, variables, is_default)
VALUES (
  gen_random_uuid(),
  NULL,
  'Hợp đồng thuê ngắn hạn',
  'HỢP ĐỒNG THUÊ NHÀ NGẮN HẠN

Hôm nay, ngày {{contract_date}}, tại {{property_address}}, chúng tôi gồm có:

BÊN CHO THUÊ:
Ông/Bà: {{landlord_name}}
CCCD: {{landlord_id_card}}
SĐT: {{landlord_phone}}

BÊN THUÊ:
Ông/Bà: {{tenant_full_name}}
CCCD: {{tenant_id_card}}
SĐT: {{tenant_phone}}
Email: {{tenant_email}}

ĐIỀU 1: NỘI DUNG
Bên A cho Bên B thuê ngắn hạn tại: {{property_address}}

ĐIỀU 2: THỜI GIAN
Từ {{start_date}} đến {{end_date}}

ĐIỀU 3: GIÁ THUÊ
- Tổng chi phí: {{monthly_rent}} VNĐ
- Đặt cọc: {{deposit}} VNĐ
- Bao gồm: Điện, nước, internet

ĐIỀU 4: CAM KẾT
- Bên B giữ gìn tài sản
- Bên A đảm bảo chất lượng dịch vụ

Hợp đồng lập thành 02 bản.


BÊN CHO THUÊ                                BÊN THUÊ',
  '[
    {"key": "contract_date", "label": "Ngày ký", "type": "date", "required": true},
    {"key": "property_address", "label": "Địa chỉ", "type": "text", "required": true},
    {"key": "landlord_name", "label": "Chủ nhà", "type": "text", "required": true},
    {"key": "landlord_id_card", "label": "CCCD chủ", "type": "text", "required": true},
    {"key": "landlord_phone", "label": "SĐT chủ", "type": "text", "required": true},
    {"key": "tenant_full_name", "label": "Người thuê", "type": "text", "required": true},
    {"key": "tenant_id_card", "label": "CCCD", "type": "text", "required": true},
    {"key": "tenant_phone", "label": "SĐT", "type": "text", "required": true},
    {"key": "tenant_email", "label": "Email", "type": "text", "required": false},
    {"key": "start_date", "label": "Từ ngày", "type": "date", "required": true},
    {"key": "end_date", "label": "Đến ngày", "type": "date", "required": true},
    {"key": "monthly_rent", "label": "Chi phí", "type": "currency", "required": true},
    {"key": "deposit", "label": "Đặt cọc", "type": "currency", "required": true}
  ]'::jsonb,
  true
) ON CONFLICT DO NOTHING;

-- Re-enable RLS
ALTER TABLE public.contract_templates ENABLE ROW LEVEL SECURITY;
