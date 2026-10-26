---
title: Recurrent neural networks and LSTM
summary: Networks that read a sequence one step at a time and carry a memory forward, with LSTM adding gates that decide what to keep and what to forget.
category: Architectures
status: seedling
created: 2026-10-26
order: 3
problem: My data is a sequence where order matters, like daily sales, sensor readings or the words in a sentence. A plain neural network sees a fixed set of inputs and has no idea what came before.
why: A recurrent network reuses the same weights at every step and passes a summary of the past, the hidden state, to the next step. It handles sequences of any length and learns patterns over time. LSTM fixes the plain version’s short memory, which made it the standard for sequences until transformers arrived. It is still a good, light choice for time series and streaming data.
decides: At each time step, the network combines the new input with the previous hidden state, using a weighted sum and an activation function, to get a new hidden state. An LSTM also keeps a separate memory cell, and three gates, each a number between 0 and 1, decide how much old memory to keep, how much new information to write and how much to output. After the last step, a final layer turns the hidden state into a prediction, like tomorrow’s value or a class probability.
assumptions:
  - Order matters, and recent history helps predict what comes next.
  - The patterns you need span tens to a few hundred steps. For very long text, transformers do much better.
related: [deep-learning/neural-network, deep-learning/backpropagation-and-gradient-descent, deep-learning/transformer]
references:
  - title: IBM, What is deep learning?
    url: https://www.ibm.com/think/topics/deep-learning
  - title: Hochreiter and Schmidhuber (1997), Long short-term memory. Neural Computation.
  - title: Christopher Olah (2015), Understanding LSTM networks
    url: https://colah.github.io/posts/2015-08-Understanding-LSTMs/
  - title: Goodfellow, Bengio and Courville (2016), Deep Learning. MIT Press. Chapter 10.
    url: https://www.deeplearningbook.org/
tags: [deep-learning, sequences, time-series, rnn, lstm]
---

## How it works

**A plain RNN.** At each step $t$, the network takes the new input $x_t$ and its previous hidden state $h_{t-1}$, and computes

$$
h_t = \tanh(W_x x_t + W_h h_{t-1} + b)
$$

The same weights are used at every step, so the network has the same size whether the sequence is 10 or 10,000 steps long. The hidden state is its memory.

**The problem, vanishing gradients.** Training adjusts weights by sending the error backwards through every time step. At each step the signal is multiplied by roughly the same factor. If that factor is below 1, the signal fades, and the network can’t learn that something 50 steps ago mattered.

**LSTM, long short-term memory.** It adds a **cell state**, a separate memory lane, controlled by three gates:

| Gate | Question it answers |
| --- | --- |
| Forget gate $f_t$ | How much of the old memory should I keep? |
| Input gate $i_t$ | How much of the new information should I write? |
| Output gate $o_t$ | How much of the memory should I show to the next layer? |

The memory is updated by adding, not multiplying through a squashing function:

$$
c_t = f_t \cdot c_{t-1} + i_t \cdot \tilde{c}_t
$$

where $\tilde{c}_t$ is the new candidate information. When the forget gate is close to 1, the memory, and the training signal, passes through almost unchanged.

The **GRU**, gated recurrent unit, is a simpler version with two gates. It often works about as well and trains faster.

## How it decides, step by step

A tiny RNN with one unit, $W_x = 0.5$ and $W_h = 0.8$, reads the inputs 1, 0, 0:

1. $h_1 = \tanh(0.5 \cdot 1) = 0.462$. It has seen the 1.
2. $h_2 = \tanh(0.8 \cdot 0.462) = 0.354$. No new input, the memory fades.
3. $h_3 = \tanh(0.8 \cdot 0.354) = 0.276$. Fading further.

Each step keeps less of the past. Over 50 steps, a factor of 0.8 shrinks a signal to $0.8^{50} \approx 0.00001$, which is why plain RNNs forget.

An LSTM whose forget gate has learned to sit at 0.95 keeps $0.95^{50} \approx 0.08$ of its memory after 50 steps, and can push the gate even closer to 1 when something must be remembered. A final linear layer then turns the last hidden state into, say, a forecast for tomorrow.

## In code

```python
import torch.nn as nn

class Forecaster(nn.Module):
    def __init__(self, n_features, hidden=64):
        super().__init__()
        self.lstm = nn.LSTM(n_features, hidden, batch_first=True)
        self.head = nn.Linear(hidden, 1)

    def forward(self, x):                  # x: (batch, time steps, features)
        out, _ = self.lstm(x)
        return self.head(out[:, -1])       # predict from the last hidden state

model = Forecaster(n_features=3)           # e.g. 30 days of sales, price and weather
```

## Watch out for

- Shuffling time series when splitting data. Train on the past and test on the future, or the model sees tomorrow while learning today.
- Skipping a simple baseline. For many forecasting problems, “same as last week” or gradient boosting on lag features beats an LSTM with far less work.
- Very long sequences. Training is slow because steps run one after another, not in parallel. For long text, use a [transformer](/toolbox/deep-learning/transformer/).
