export const environment = {
  production: true,
  apiUrl: window['env'] && window['env']['apiUrl'] ? window['env']['apiUrl'] : 'https://api.myapp.com'
};
