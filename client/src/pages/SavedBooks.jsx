import { useState, useEffect } from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME, REMOVE_BOOK } from '../utils/queries';  
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});

  const { data } = useQuery(GET_ME, {
    variables: { token: Auth.getToken() },
    skip: !Auth.loggedIn(),
  });

  useEffect(() => {
    if (data?.me?.savedBooks) {
      setUserData(data.me);
    }
  }, [data]);

  const [removeBook] = useMutation(REMOVE_BOOK);

  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({ variables: { bookId } });
      setUserData(prevState => ({
        ...prevState,
        savedBooks: prevState.savedBooks.filter(book => book.bookId !== bookId),
      }));
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (!userData.savedBooks) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map(book => (
            <Col md="4" key={book.bookId}>
              <Card border='dark'>
                {book.image && (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                )}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button
                    className='btn-block btn-danger'
                    onClick={() => handleDeleteBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
