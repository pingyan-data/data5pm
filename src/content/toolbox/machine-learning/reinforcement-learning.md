---
title: Reinforcement learning
summary: An agent learns which actions to take by trial and error, guided by rewards and penalties from its environment.
category: Reinforcement learning
status: seedling
created: 2026-10-25
order: 1
problem: I don’t have labelled examples of the right answer, but I can try actions and see how well things go afterwards, like choosing prices, controlling a robot or playing a game.
why: It learns from consequences rather than from labels, and it plans for long-term reward, not just the next step. It is also how large language models are tuned to be more helpful, through reinforcement learning from human feedback.
decides: The agent looks at the current state and picks the action its policy rates best, the one with the highest expected total future reward. Now and then it picks a random action instead, to explore and keep learning.
assumptions:
  - You can define a reward that truly reflects what you want. Agents are very good at exploiting a badly designed reward.
  - The agent can try many actions, usually in a simulation. Learning by trial and error in the real world is slow and can be risky.
related: []
references:
  - title: Stanford HAI, What is reinforcement learning?
    url: https://hai.stanford.edu/ai-definitions/what-is-reinforcement-learning
  - title: Sutton and Barto (2018), Reinforcement Learning, An Introduction, 2nd edition. Free online.
    url: http://incompleteideas.net/book/the-book-2nd.html
  - title: Gymnasium documentation
    url: https://gymnasium.farama.org/
tags: [reinforcement-learning, agents]
---

## How it works

The building blocks:

| Term | Meaning | Example: a robot vacuum |
| --- | --- | --- |
| Agent | The learner that acts | The vacuum |
| Environment | Everything the agent interacts with | The flat |
| State | What the agent observes now | Its position and battery level |
| Action | What it can do | Move, turn, return to the dock |
| Reward | Feedback after an action | +1 for clean floor, −10 for running out of battery |
| Policy | Its rule for choosing actions | The thing being learned |

The agent wants to maximise the **total** future reward, not just the next one. A **discount factor** $\gamma$ between 0 and 1 makes rewards far in the future count a little less.

The central tension is **exploration vs exploitation**: keep doing what has worked, or try something new that might work better.

## How it decides, step by step

Q-learning, a classic method, keeps a score $Q(s, a)$ for every state and action: the expected total reward of taking action $a$ in state $s$ and acting well afterwards. After each step, it nudges the score towards what actually happened:

$$
Q(s, a) \leftarrow Q(s, a) + \alpha \left[ r + \gamma \max_{a'} Q(s', a') - Q(s, a) \right]
$$

$r$ is the reward received, $s'$ the new state, and $\alpha$ the learning rate. To act, the agent picks the action with the highest $Q$ in its current state, except with a small probability $\varepsilon$ (say 10%), when it picks randomly to explore.

Modern methods replace the table with a neural network (deep Q-networks) or learn the policy directly (policy gradient methods like PPO).

## In code

```python
import numpy as np
import gymnasium as gym

env = gym.make("FrozenLake-v1", is_slippery=False)
Q = np.zeros((env.observation_space.n, env.action_space.n))
alpha, gamma, eps = 0.1, 0.99, 0.1

for episode in range(5000):
    s, _ = env.reset()
    done = False
    while not done:
        a = env.action_space.sample() if np.random.rand() < eps else int(Q[s].argmax())
        s2, r, terminated, truncated, _ = env.step(a)
        Q[s, a] += alpha * (r + gamma * Q[s2].max() * (not terminated) - Q[s, a])
        s, done = s2, terminated or truncated
```

## Watch out for

- Reward hacking. The agent finds a way to score points that you didn’t intend. Test the learned behaviour, not just the reward curve.
- Using full reinforcement learning when a simpler tool fits. For choosing between a few options with immediate feedback, like which banner to show, a multi-armed bandit is simpler and needs far less data.
