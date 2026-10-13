#!/usr/bin/env sh
# نشر يدوي اختياري إلى فرع gh-pages باستخدام GitHub CLI وgit.
# يتطلب: git وGitHub CLI (gh) وتسجيل الدخول مسبقًا.
set -eu
git add .
git commit -m "Update Arabic blog"
git push
echo "تم رفع التغييرات إلى المستودع. إذا كان GitHub Pages مفعّلًا، سيبدأ النشر تلقائيًا."
