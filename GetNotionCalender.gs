// トークン周りの用意
const scriptProperties = PropertiesService.getScriptProperties();
const NOTION_API_KEY = scriptProperties.getProperty('NOTION_API_KEY');
const NOTION_DATABASE_ID = scriptProperties.getProperty('NOTION_DATABASE_ID');
const NOTION_VERSION = scriptProperties.getProperty('NOTION_VERSION');

// 
function getNotionCalender() {
  // Notion APIのエンドポイントURLを作成
  const url = `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}`;

  // 送信するリクエストのヘッダー情報を作成
  const headers = {
    'Authorization': `Bearer ${NOTION_API_KEY}`,
    'Notion-Version': NOTION_VERSION,
  };

  // リクエストのオプションを設定
  const options = {
    'method': 'get',
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
      console.log("✅ Notionデータベースの情報を正常に取得しました。");
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
