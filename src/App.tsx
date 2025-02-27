import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Cart from './components/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import CheckoutConfirmation from './pages/CheckoutConfirmation/CheckoutConfirmation';
import ProductCategory from './pages/ProductCategory/ProductCategory';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout-confirmation" element={<CheckoutConfirmation />} />
              <Route path="/category/:category" element={<ProductCategory />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;