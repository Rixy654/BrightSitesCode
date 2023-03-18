# Bright Sites Code

This code was written as a node command line tool to help calculate share distributions given exit distribution and liquidation preferences.

To explain and for simplicity, one shareholder is equal to one share class. Thus, the ownership distribution is:

- **Founders:** 33.33%
- **Preferred A Investors:** 6.67%
- **Preferred B Investors:** 10%
- **Preferred C Investors:** 50%

The cap table has the following properties:

- The founders own Common shares with *no liquidation preference*
- The Preferred share classes each have a *1× participating preference with 2× cap*
- *Preferred C has the highest priority, Common the lowest*

*Cap table:*

| Share class | # of shares | Invested amount |
|-------------|-------------|-----------------|
| Common      | 1,000,000   | 0               |
| Preferred A | 200,000     | 900,000.00      |
| Preferred B | 300,000     | 2,100,000.00    |
| Preferred C | 1,500,000   | 15,000,000.00   |


*To run*
npm run init {amount} {json file dependant on stage}
e.g. npm run init 60000000, "./data/cap-table-stage-1.json"
Stages are detailed below:

#### Stage 1

Compute the exit distribution at *€60m*.

This is the most basic case. All shares convert to Common shares, liquidation preferences will be ignored.

#### Stage 2

Compute the exit distribution at *€25m*.

The investors receive their 1× liquidation preference. The total is €18m, the remaining €7m are distributed pro-rata to all shareholders (that’s participation).

#### Stage 3

Compute the exit distribution at *€35m*.

Now, the cap comes into play. If computed as before, the Series A shares would get €0.9 + €1.13m (6.67% of €17m). That’s too much, the cap is 2× or €1.8m. To solve this, we give €1.8m to the Series A shares and distribute the remaining €16.1m pro-rata to all other shareholders.

#### Stage 4

Compute the exit distribution at *€45m*.

We observe the first conversion to Common shares. Preferred B has reached the cap and gets a fixed €2.1 + €2.1m. Preferred A could get €1.8m using their liquidation preference. However, if they convert to Common and ignore their preference, they end up with more. The liquidation preferences sum up to €19.2m.
