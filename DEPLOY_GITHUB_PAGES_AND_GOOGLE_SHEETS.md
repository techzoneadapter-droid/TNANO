# Deploy Static Website + Google Sheets Leads

## 1. Tao Google Sheet

1. Vao Google Drive va tao Google Sheet moi.
2. Doi ten file, vi du: `TNANO Leads`.
3. Tao 2 sheet voi dung ten:
   - `TU_VAN_MAU`
   - `DANG_KY_DAI_LY`
4. Hang tieu de co the de trong, Apps Script se tu tao neu sheet dang rong.

## 2. Tao Google Apps Script

1. Trong Google Sheet, vao `Extensions > Apps Script`.
2. Xoa code mac dinh trong `Code.gs`.
3. Dan toan bo code tu file `google-apps-script/Code.gs`.
4. Bam `Save`.

## 3. Deploy Apps Script thanh Web App

1. Bam `Deploy > New deployment`.
2. Chon type la `Web app`.
3. `Execute as`: chon `Me`.
4. `Who has access`: chon `Anyone`.
5. Bam `Deploy`.
6. Cap quyen theo man hinh Google.
7. Copy `Web app URL`.

## 4. Dan URL Apps Script vao website

Mo file `.env.local` va dan URL vao:

```env
NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/xxxxx/exec
```

Sau khi doi `.env.local`, chay lai:

```bash
npm run build
```

Thu muc static export se nam o:

```text
out/
```

## 5. Deploy GitHub Pages

1. Tao repository GitHub.
2. Push source code len repository.
3. Trong GitHub repo, vao `Settings > Pages`.
4. Cach don gian nhat: dung GitHub Actions de build va publish folder `out`.
5. Repo nay da co workflow `.github/workflows/deploy.yml`.
6. Vao `Settings > Secrets and variables > Actions > New repository secret`.
7. Tao secret:
   - `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL`
8. Neu dung tracking, tao them:
   - `NEXT_PUBLIC_META_PIXEL_ID`
   - `NEXT_PUBLIC_GA_ID`
   - `NEXT_PUBLIC_GTM_ID`

Vi Next.js doc bien `NEXT_PUBLIC_*` luc build, moi lan doi URL Apps Script can build lai.

Workflow mac dinh build cho GitHub Pages dang `https://username.github.io/repo-name` bang:

```env
NEXT_PUBLIC_BASE_PATH=/repo-name
```

Neu ban dung custom domain hoac repo `username.github.io`, hay sua workflow de `NEXT_PUBLIC_BASE_PATH` rong.

## 6. Test form

1. Mo website da build bang static hosting.
2. Submit form `Dang ky tu van mau son`.
3. Kiem tra sheet `TU_VAN_MAU`.
4. Submit form `Dang ky tro thanh dai ly`.
5. Kiem tra sheet `DANG_KY_DAI_LY`.

Neu chua thay dong moi, kiem tra lai:

- Apps Script Web App URL da dung `/exec`.
- Deployment access la `Anyone`.
- `.env.local` hoac GitHub Actions secret da co URL.
- Da build lai sau khi dan URL.
