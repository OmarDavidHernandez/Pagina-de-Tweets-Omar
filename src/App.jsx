import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

const GET_TWEETS = gql`
  query GetTweets {
    getTweets {
      id
      text
      liked
    }
  }
`;

const CREATE_TWEET = gql`
  mutation CreateTweet($text: String!) {
    createTweet(text: $text) {
      id
      text
      liked
    }
  }
`;

const Tweets = () => {
  const { loading, error, data } = useQuery(GET_TWEETS);
  const [createTweet] = useMutation(CREATE_TWEET, {
    refetchQueries: [{ query: GET_TWEETS }],
  });

  const [newTweetText, setNewTweetText] = useState('');

  const handleNewTweet = async (e) => {
    e.preventDefault();
    if (!newTweetText.trim()) return;
    await createTweet({ variables: { text: newTweetText } });
    setNewTweetText('');
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <form onSubmit={handleNewTweet} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Nuevo tweet"
            value={newTweetText}
            onChange={(e) => setNewTweetText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Añadir Tweet
          </button>
        </div>
      </form>
      <ul className="list-group">
        {data.getTweets.map(({ id, text, liked }) => (
          <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
            {text} - <span className={liked ? 'text-success' : 'text-danger'}>{liked ? 'Liked' : 'Not Liked'}</span>
            <div>
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => handleLike(id, liked)}>
                {liked ? 'Unlike' : 'Like'}
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(id)}>
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => (
  <ApolloProvider client={client}>
    <div className="container mt-4">
      <h2 className="mb-4">Tweets:</h2>
      <Tweets />
    </div>
  </ApolloProvider>
);

export default App;