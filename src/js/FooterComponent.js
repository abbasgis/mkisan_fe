import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function FooterComponent() {
    return (
        <Navbar style={{height: "20px"}} fixed="bottom" expand="lg" variant="light" bg="black">
            <Container>
                <Navbar.Brand href="#">Navbar</Navbar.Brand>
                <marquee direction="left" style={{color:"white"}}>
                    This is a sample scrolling text that has scrolls texts to left.
                </marquee>
            </Container>
        </Navbar>
    );
}

export default FooterComponent;