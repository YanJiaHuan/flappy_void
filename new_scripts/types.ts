
export enum GameState {
  HOME = 'HOME',
  AUTH = 'AUTH',
  LEADERBOARD = 'LEADERBOARD',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER'
}

export interface User {
  username: string;
  bestScore: number;
}

export interface Obstacle {
  id: number;
  x: number;
  gapTop: number;
  width: number;
  passed: boolean;
}

export const ASSETS = {
  SKULL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr7clxIDj-DS1MC3IKN2qQb2hRfFEiIzxRrMMvaLfRAnTLzUvGotQLySPtNchCcCW7vKAObJY0Vem3zOBL5XqEBbT0FcQvxPmsuAd-NgLtH0EftvxkwE5tEuZCNcfgE4KIgWD99FxcaJnRDiZIvjUmttWQJVSPWC1TkpiQasR8QpwnMNlIOFd09ATvzRX_9EbikEYNQd_LZCRCmD_T-nscb8z0t6nXIqHWZ6MF5KDP9vpl5kkm4q-Cp2MJidbIJQYg79tdLGJwYXrI',
  NEBULA: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6ZybPz8O8C7eXVhh8fwOQXHXj_NSxQ8yycvELci9vkAgkG7LJ9st4KhhiiKF7BxzbDUn73h7URJApYMnEBiT-z7YDLs06v-Y3wRQeBohncX66zk1PEZHjt9B5WxyEWBwbYWyzKeHPkFd-v3ZJLwjbT1iw5VMiS0YV3xIqie5F3oieSWzyaCLusUMcXHbXRjbeN2TfZpAAYTtBPMCyAbx-ijy7QxsOa003X_ruZhNJhOH-_3WVOQMBsE0_14KTCSpi9ocbX9-_zg0d',
  CHARACTER: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQSCtbsch3nFlrNlW4ayxboszvuFL1lcFS3BkwQrGcamrLnjYzjM65o8zdUWK40bjNFkU_YG70Hq00yKC_AvLSdn_96u6Z5WfSTfYbmuA0XeJJU30i27x_g0veC01m3U7YBFxoiv67cMAMEdflwMTxFCkUJu7FfWxCHJZkYVI-mywY0hbD9AuheID0oG5nu11602tFeXt64ihLWvbLpwn1PLtw1lsVcqp1FDMOJiJFzyX0mHYwbpaJ4Iyafq7oH7eWTeR53sMagEzq',
  COSMIC_BG: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJnUOwKfEnwSH-eImubLEu82GoS2nRwIltbiYit2dSwlaNxJkONE2AzP0QKawbQ0AotRQA2oxGZjWOZcj1PDubS3I7e-3vLm7f18GOqxZ8U45JDw3RXtT7K7SPW0F35DR-CvdBjLK1khCkym7Yxg2_9hueIfNNd7y564BlF0T7JPc_J8hH--OScgwWXP31kL4e_G3KWS9NowHNJaJk_iaDgRGh48YDgMWY1bJOPuKuTA3jL2VjOQVoox2jrvu4GrYy0E0Jiwt_djK-',
  SETTLEMENT_BG: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqLh0uBxoyo-ROB6IKhrgtRJJ01LRc_UjyVmZJpbNjLB-r-kUukl4w0Z-BRFAiLYzElR1H14TimQojjCtoAaxAObDRQEO1sTg5jegoNdu8YHSAO9evpYXKwsU2VMY0KmBuml_jrr-ezbxG9Wj0ZMq9898H4HczaMwVsGMhvjRjmfJsqyupEn1UPGfZFa2mRTpvLvnyxewIt0AVf55-wG3TJriRpC0Gx86PbycDEzUj2gSUDwwEJz5D3E7R1EEWBdlxoUt8euRjf3W-',
  AVATAR_1: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwgRGHqJEQyMaO01hvdwTetDFTcub-jua6as1eKsL-qSfehQKroeO25KkDgnwSJ765InxuxRTGZzUPn13L8iuHBjTb5xAjTyV8moQqCV-EWHiOd1sp5vtJsp41F4zofatml6ITw8caany6UtKhjYBVmRGxUhKZwXX1Dp5y7yuv8ecLc8LsAtzcIfz0vyTscK7W1eJVBUaO4dM9bWn-rxPgJn-r3LFP-VUa5KI3KjGA2fcDWi7hGLoOJSQ0Rv8WTmt42R37fpFolqbS'
};
