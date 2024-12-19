/**
 * loading 占位
 * 解决首次加载时白屏的问题
 */
(function () {
  const div = document.createElement('div');
  const body = document.querySelector('body');
  body.appendChild(div);
  div.setAttribute('id', 'loading-app');
  if (div && div.innerHTML === '') {
    div.innerHTML = `
      <style>

        :root{
          --loading-spinner-size: 4.5rem;
        }

        html,
        body,
        #loading-app {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        #loading-app {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          background-repeat: no-repeat;
          background-size: 100% auto;
        }

        .loading-title {
          margin-top: 2rem;
          font-size: 1.1rem;
        }

        .loading-sub-title {
          margin-top: 20px;
          font-size: 1rem;
          color: #888;
        }

        .breeding-rhombus-spinner {
          height: var(--loading-spinner-size);
          width: var(--loading-spinner-size);
          position: relative;
          transform: rotate(45deg);
        }
        .breeding{
          position: relative;
        }

        .breeding::before {
          position: absolute;
          top: calc(var(--loading-spinner-size) + 0.6rem);
          left: 0;
          width: var(--loading-spinner-size);
          height: 5px;
          content: '';
          background: #007fff80;
          border-radius: 50%;
          animation: shadow-ani 2s linear infinite;
          transform: rotate(45deg);
        }

        .breeding-rhombus-spinner, .breeding-rhombus-spinner * {
          box-sizing: border-box;
        }

        .breeding-rhombus-spinner .rhombus {
          height: calc(var(--loading-spinner-size) / 8);
          width: calc(var(--loading-spinner-size) / 8);
          animation-duration: 2000ms;
          top: calc(var(--loading-spinner-size) / 2.3077);
          left: calc(var(--loading-spinner-size) / 2.3077);
          background-color: var(--primary, #007fff);
          position: absolute;
          animation-iteration-count: infinite;
        }

        .breeding-rhombus-spinner .rhombus:nth-child(2n+0) {
          margin-right: 0;
        }

        .breeding-rhombus-spinner .rhombus.child-1 {
          animation-name: breeding-rhombus-spinner-animation-child-1;
          animation-delay: calc(100ms * 1);
        }

        .breeding-rhombus-spinner .rhombus.child-2 {
          animation-name: breeding-rhombus-spinner-animation-child-2;
          animation-delay: calc(100ms * 2);
        }

        .breeding-rhombus-spinner .rhombus.child-3 {
          animation-name: breeding-rhombus-spinner-animation-child-3;
          animation-delay: calc(100ms * 3);
        }

        .breeding-rhombus-spinner .rhombus.child-4 {
          animation-name: breeding-rhombus-spinner-animation-child-4;
          animation-delay: calc(100ms * 4);
        }

        .breeding-rhombus-spinner .rhombus.child-5 {
          animation-name: breeding-rhombus-spinner-animation-child-5;
          animation-delay: calc(100ms * 5);
        }

        .breeding-rhombus-spinner .rhombus.child-6 {
          animation-name: breeding-rhombus-spinner-animation-child-6;
          animation-delay: calc(100ms * 6);
        }

        .breeding-rhombus-spinner .rhombus.child-7 {
          animation-name: breeding-rhombus-spinner-animation-child-7;
          animation-delay: calc(100ms * 7);
        }

        .breeding-rhombus-spinner .rhombus.child-8 {
          animation-name: breeding-rhombus-spinner-animation-child-8;
          animation-delay: calc(100ms * 8);
        }

        .breeding-rhombus-spinner .rhombus.big {
          height: calc(var(--loading-spinner-size) / 3);
          width: calc(var(--loading-spinner-size) / 3);
          top: calc(var(--loading-spinner-size) / 3);
          left: calc(var(--loading-spinner-size) / 3);
          background-color: var(--primary, #007fff);
          animation: breeding-rhombus-spinner-animation-child-big 2s infinite;
          animation-delay: 0.5s;
        }

        @keyframes shadow-ani {
          0%,
          100% {
            transform: scale(0.3, 1);
          }

          50% {
            transform: scale(1, 1);
          }
        }

        @keyframes breeding-rhombus-spinner-animation-child-1 {
          50% {
            transform: translate(-250%, -250%);
          }
        }

        @keyframes breeding-rhombus-spinner-animation-child-2 {
          50% {
            transform: translate(0, -250%);
          }
        }

        @keyframes breeding-rhombus-spinner-animation-child-3 {
          50% {
            transform: translate(250%, -250%);
          }
        }

        @keyframes breeding-rhombus-spinner-animation-child-4 {
          50% {
            transform: translate(250%, 0);
          }
        }

        @keyframes breeding-rhombus-spinner-animation-child-5 {
          50% {
            transform: translate(250%, 250%);
          }
        }

        @keyframes breeding-rhombus-spinner-animation-child-6 {
          50% {
            transform: translate(0, 250%);
          }
        }

        @keyframes breeding-rhombus-spinner-animation-child-7 {
          50% {
            transform: translate(-250%, 250%);
          }
        }

        @keyframes breeding-rhombus-spinner-animation-child-8 {
          50% {
            transform: translate(-250%, 0);
          }
        }

        @keyframes breeding-rhombus-spinner-animation-child-big {
          50% {
            transform: scale(0.5);
          }
        }

      </style>

      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-height: 362px;
      ">
        <div class="breeding">
          <div class="breeding-rhombus-spinner">
            <div class="rhombus child-1"></div>
            <div class="rhombus child-2"></div>
            <div class="rhombus child-3"></div>
            <div class="rhombus child-4"></div>
            <div class="rhombus child-5"></div>
            <div class="rhombus child-6"></div>
            <div class="rhombus child-7"></div>
            <div class="rhombus child-8"></div>
            <div class="rhombus big"></div>
          </div>
        </div>
        <div class="loading-title">
          正在加载资源
        </div>
        <div class="loading-sub-title">
          初次加载资源可能需要较多时间 请耐心等待
        </div>
      </div>
    `;
  }
})();
