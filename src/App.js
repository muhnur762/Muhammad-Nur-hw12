import * as React from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { Box, ChakraProvider,Button, Text, VStack, SimpleGrid } from '@chakra-ui/react';
import { MdRestartAlt } from "react-icons/md";

// Reducer slice
const ticTacToe = createSlice({
  name: 'ticTacToe',
  initialState: {
    squares: Array(9).fill(null),
    currentStep: 0,
    winner: null,
    nextValue: 'X',
    status: 'Next player: X',
  },
  reducers: {
    selectSquare(state, action) {
      if (!state.winner && !state.squares[action.payload]) {
        const nextSquares = [...state.squares];
        nextSquares[action.payload] = calculateNextValue(state.squares);
        const winner = calculateWinner(nextSquares);
        const nextValue = calculateNextValue(nextSquares);
        const status = calculateStatus(winner, nextSquares, nextValue);
        return {
          squares: nextSquares,
          winner,
          nextValue,
          status
        };
      }
    },
    restart(state) {
      const nextSquares = Array(9).fill(null);
      const winner = calculateWinner(nextSquares);
      const nextValue = calculateNextValue(nextSquares);
      const status = calculateStatus(winner, nextSquares, nextValue);
      return {
        squares: nextSquares,
        winner,
        nextValue,
        status,
      };
    },
  },
});


export const { selectSquare, restart, jumpToMove } = ticTacToe.actions;

const store = configureStore({
  reducer: ticTacToe.reducer,
});

function Board() {
  const { status, squares } = useSelector(state => state);
  const dispatch = useDispatch();
  function squareHandler(squareIndex) {
    dispatch(selectSquare(squareIndex));
  }
  function renderSquare(i) {
    return (
      <Button
        w='10'
        h='10'
        colorScheme='linkedin'
        bgColor='#89CFF3'
        onClick={() => squareHandler(i)}>
        {squares[i]}
      </Button>
    );
  }

  return (
    <VStack mt={4}>
      <Text fontSize="4xl" fontWeight="bold" mb={6}>
        {status}
      </Text>
      <SimpleGrid columns={3} spacing={2} >
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </SimpleGrid>
      <SimpleGrid columns={3} spacing={2} >
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </SimpleGrid>
      <SimpleGrid columns={3} spacing={2} >
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </SimpleGrid>
    </VStack>
  );
}

function Game() {
  const dispatch = useDispatch();
  function handleRestart() {
    dispatch(restart());
  }
  return (
    <Box bg="#CDF5FD" h="100vh" p={20}>
        <Board />
        <VStack>
          <Button leftIcon={<MdRestartAlt/>} size="md" onClick={handleRestart} mt={4} colorScheme="messenger">
            restart
          </Button>
        </VStack>
    </Box>
  );
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
      ? `Scratch: Cat's game`
      : `Next player: ${nextValue}`;
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O';
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function App() {
  return (
    <ChakraProvider>
      <Provider store={store}>
        <Game />
      </Provider>
    </ChakraProvider>
  );
}

export default App;