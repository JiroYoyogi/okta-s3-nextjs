# 社内サイトDEMO

## Getting Started

```bash
# モジュールインストール
npm install
# ローカル開発
npm run dev
# 本番ビルド
npm run build
```

## IDトークンから名前・メールアドレス取得

### ライブラリ追加

```
npm i jwt-decode
```

### コード変更

（src/app/page.tsx）

- ID_TOKENを手動で追加
- ID_TOKENをJSで取得
- user_nameをIDトークンに含める設定

```jsx
"use client";
import Image from "next/image";
import LogoutButton from "@/components/LogoutButton";
import { useEffect, useState } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";

interface MyIdToken extends JwtPayload {
  email?: string;
  user_name?: string;
}

export default function Home() {
  const [idToken, setIdToken] = useState<MyIdToken>({});
  useEffect(() => {
    const cookies = document.cookie.split(";");
    const cookieKeyVal: { [key: string]: string } = cookies.reduce((wip, c) => {
      const [key, value] = c.split("=").map((s) => s.trim());
      if (key) {
        wip[key] = value ?? "";
      }
      return wip;
    }, {} as { [key: string]: string });
    const idTokenFromCookie = cookieKeyVal.ID_TOKEN;
    console.log(idTokenFromCookie);
    if (!idTokenFromCookie) return;
    const idTokenDecoded = jwtDecode(idTokenFromCookie);
    console.log(idTokenDecoded);
    setIdToken(idTokenDecoded);
  }, []);

  return (
    <main className="flex flex-col gap-[24px] items-center justify-center min-h-screen">
      <Image
        className="dark:invert"
        src="/logo.png"
        alt=""
        width={200}
        height={200}
        priority
      />

      <h1 className="text-orange-600 text-2xl font-bold">社員限定極秘サイト</h1>

      <div className="text-center">
        <p>
          NEKOMATA CODE社内向けの
          <span className="text-orange-600">社外秘盛り沢山</span>のサイトです。
        </p>
        <p className="mt-2">
          外部に漏れたらにまずい情報をたっぷり掲載しています。
        </p>
        {
        idToken ? (
          <div className="text-center mt-2">
            <p>{ idToken?.user_name }さん</p>
            <p>（{ idToken?.email }）</p>
            <p>ログイン中</p>
          </div>
        ) : null
        }
      </div>
      <LogoutButton />
    </main>
  );
}

```

### IDトークンにユーザー名を入れる

okta管理画面 > API > 認可サーバー > クレーム

- 名前: `user_name`
- トークンに含める: IDトークン、常に
- 値: `user.firstName + " " + user.lastName`
- クレームを無効化: チェック無し
- 含める: いずれかのスコープ