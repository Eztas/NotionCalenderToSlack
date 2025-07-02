// トークン周りの用意
const scriptProperties = PropertiesService.getScriptProperties();
const NOTION_API_KEY = scriptProperties.getProperty('NOTION_API_KEY');
const NOTION_DATABASE_ID = scriptProperties.getProperty('NOTION_DATABASE_ID');
const NOTION_VERSION = scriptProperties.getProperty('NOTION_VERSION');

// Notionのカレンダー(データベース形式)情報の取得
function getNotionCalender() {
  // Notion APIのエンドポイントURLを作成
  const url = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`;
  
  // 今日の日付とリマインド用の前日の日付を取得
  const nowDate = new Date();
  const remindDate = new Date();
  const remindSpan = 1
  remindDate.setDate(nowDate.getDate() - remindSpan);
  const nowFormatDate = Utilities.formatDate(nowDate, 'JST', 'yyyy-MM-dd');
  const remindFormatDate = Utilities.formatDate(remindDate, 'JST', 'yyyy-MM-dd');

  // 送信するリクエストのヘッダー情報を作成
  const headers = {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': NOTION_VERSION,
  };

  // リクエストのオプションを設定
  // queryの場合はPOSTメソッドを使用　
  const options = {
    'method': 'post',
    'headers': headers,
    'muteHttpExceptions': true // エラー時に例外をスローせず、レスポンスを返す
  };

  try {
    // APIにリクエストを送信
    const response = UrlFetchApp.fetch(url, options);

    // レスポンスのHTTPステータスコードを確認
    const responseCode = response.getResponseCode();
    // レスポンスの本文を取得
    const responseBody = response.getContentText();

    // ログに出力して確認
    Logger.log(`Response Code: ${responseCode}`);
    
    if (responseCode === 200) {
      // 成功した場合、JSONをパースして見やすく表示
      const jsonResponse = JSON.parse(responseBody);
      Logger.log(JSON.stringify(jsonResponse, null, 2));
      console.log("✅ Notionデータベースのページ情報を正常に取得しました。");

      // results配列の中の各ページ（イベント）をループ処理
      jsonResponse.results.forEach(page => {
        // 「名前」プロパティが存在し、かつtitle配列に中身があるかチェック
        if (page.properties.名前 && page.properties.名前.title.length > 0 
            && (page.properties.日付.date.start == nowFormatDate || page.properties.日付.date.start == remindFormatDate)) {
          
          // 予定の名前を取得
          const eventName = page.properties.名前.title[0].plain_text;
          
          // ログに出力
          Logger.log("イベント名: "+eventName); // "実験" と出力される
        }
      });
    } else {
      // エラーの場合、エラーメッセージを表示
      Logger.log(`Error: ${responseBody}`);
      console.error(`❌ Notion APIからのデータ取得に失敗しました。ステータスコード: ${responseCode}`);
    }

  } catch (error) {
    Logger.log(`An unexpected error occurred: ${error.message}`);
    console.error(`予期せぬエラーが発生しました: ${error.message}`);
  }
}
