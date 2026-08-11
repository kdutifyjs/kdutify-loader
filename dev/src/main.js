import 'kdutify/src/stylus/app.styl'
import Kdu from 'kdu'
import Kdutify from 'kdutify/lib'
import App from './App.kdu'

Kdu.use(Kdutify)

new Kdu({
  el: '#app',
  render: h => h(App)
})
