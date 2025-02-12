import './App.css'
import NavBar from './components/layout/Navbar';
import Logo from '../src/assets/react.svg'

function App() {
  const items = ['Home', 'About', 'Services', 'Contact']

  return (
    <>
    <NavBar 
    brandName='My WAP'
    imageSrcPath= {Logo}
    navItems={items} />
    </>
  )
}

export default App
