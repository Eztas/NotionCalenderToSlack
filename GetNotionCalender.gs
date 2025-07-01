// トークン周りの用意
const scriptProperties = PropertiesService.getScriptProperties();
const NOTION_API_KEY = scriptProperties.getProperty('NOTION_API_KEY');
const NOTION_DATABASE_ID = scriptProperties.getProperty('NOTION_DATABASE_ID');
const NOTION_VERSION = scriptProperties.getProperty('NOTION_VERSION');
