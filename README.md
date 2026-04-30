# 软件工程法则

写代码时值得记住的一些道理。

## 在线访问

部署后填写...

## 安装APK

1. 前往 [Actions](../../actions) 页面
2. 点击最新的 "Build Android APK" 工作流
3. 在 "Artifacts" 区域下载 `app-debug`
4. 解压后在手机上安装 APK

## 本地开发

```bash
cd vue-app
npm install
npm run dev
```

## 构建PWA

```bash
cd vue-app
npm run build
```

## 构建Android APK（需要Android SDK）

```bash
cd vue-app
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```
