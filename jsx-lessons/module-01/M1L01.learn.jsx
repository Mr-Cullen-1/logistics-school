import React, { useEffect, useRef, useState } from "react";
import { RiveRoute } from "@coliseum/kit";

export const meta = { type: "learn", lessonCode: "M1L01", seq: 0, skillTags: ["svo_order", "be_have_need", "wh_questions"] };

const STYLES = `
.m1-root{--background:#0d1114;--surface:#171b1e;--surface-elevated:#1d2226;--bronze:#c19a63;--bronze-light:#e0c28c;--ivory:#f3efe7;--foreground:#f5f3ee;--text-secondary:#c7c9c9;--line:#ffffff2a;--success:#9cddb5;--warn:#f0bc84;--radius:12px;--font-sans:Geist,system-ui,sans-serif;box-sizing:border-box;width:100%;height:100dvh;display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:clamp(5px,1vh,12px);padding:clamp(7px,1.4vh,16px);background:radial-gradient(circle at 82% 0%,#c19a6326,transparent 42%),var(--background);color:var(--foreground);font-family:var(--font-sans);overflow:hidden}
.m1-root *{box-sizing:border-box}.m1-root button{font:inherit;color:inherit;cursor:pointer}.m1-root button:focus-visible{outline:3px solid var(--bronze-light);outline-offset:2px}.m1-root button:disabled{cursor:not-allowed;opacity:.45}.m1-root p,.m1-root h1{margin:0}
.m1-head,.m1-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;max-width:980px;width:100%;margin:0 auto}
.m1-eyebrow{color:var(--bronze-light);font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}
.m1-dots{display:flex;gap:3px;flex-wrap:nowrap}.m1-dot{width:11px;height:4px;border-radius:4px;background:#454b4e}.m1-dot.on{background:var(--bronze)}
.m1-body{min-height:0;display:flex;flex-direction:column;justify-content:center;gap:clamp(5px,1.2vh,12px);max-width:980px;width:100%;margin:0 auto;overflow:hidden;perspective:1100px}
.m1-slide{display:flex;flex-direction:column;gap:clamp(5px,1.2vh,12px);animation:m1-in .55s cubic-bezier(.2,.8,.2,1) both;transform-origin:50% 100%}
@keyframes m1-in{from{opacity:0;transform:translate3d(30px,0,-80px) rotateY(10deg)}to{opacity:1;transform:none}}
.m1-title{font-size:clamp(20px,2.8vw,34px);font-weight:600;letter-spacing:-.02em;line-height:1.1}
.m1-sub{font-size:clamp(12px,1.4vw,15px);color:var(--text-secondary);line-height:1.35}
.m1-en{font-size:clamp(14px,1.9vw,20px);font-weight:600;line-height:1.25}
.m1-muted{color:var(--text-secondary);font-size:clamp(11px,1.2vw,13px);line-height:1.3}
.m1-kick{color:var(--bronze-light);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.08em}
.m1-panel{border:1px solid var(--line);border-radius:var(--radius);background:var(--surface);padding:clamp(8px,1.4vh,14px)}
.m1-list{display:grid;gap:6px}.m1-grid{display:grid;gap:7px}.m1-g2{grid-template-columns:repeat(2,minmax(0,1fr))}.m1-g3{grid-template-columns:repeat(3,minmax(0,1fr))}.m1-g4{grid-template-columns:repeat(4,minmax(0,1fr))}
.m1-opt{min-height:44px;width:100%;border:1px solid var(--line);border-radius:10px;background:var(--surface);padding:7px 11px;text-align:left;line-height:1.2;display:flex;align-items:center;gap:9px;transition:transform .25s,border-color .2s,background .2s}
.m1-opt:hover:not(:disabled){transform:translateZ(14px) translateY(-1px);border-color:var(--bronze);background:var(--surface-elevated)}
.m1-opt .k{flex:none;width:22px;height:22px;border-radius:50%;border:1px solid var(--line);display:grid;place-items:center;font-size:11px;font-weight:700;color:var(--bronze-light)}
.m1-opt.sel{border-color:var(--bronze);background:var(--surface-elevated)}.m1-opt.good{border-color:var(--success);background:#9cddb514}.m1-opt.bad{border-color:var(--warn);background:#f0bc8414}
.m1-opt strong{font-size:clamp(12px,1.35vw,15px);font-weight:600}
.m1-fb{min-height:20px;font-size:clamp(12px,1.3vw,14px);line-height:1.3;color:var(--bronze-light)}.m1-fb.good{color:var(--success)}.m1-fb.bad{color:var(--warn)}
.m1-btn{min-height:44px;border-radius:12px;padding:9px 18px;font-weight:600;border:1px solid var(--line);background:var(--surface)}
.m1-btn.p{border-color:var(--bronze);background:var(--bronze);color:var(--background)}.m1-btn.p:hover:not(:disabled){background:var(--bronze-light)}
.m1-link{border:0;background:none;color:var(--bronze-light);text-decoration:underline;min-height:44px;padding:4px 0;text-align:left}
.m1-hold{color:var(--text-secondary);font-size:12px;flex:1;text-align:center;min-width:0}@media(max-width:480px){.m1-hold{display:none}.m1-foot{justify-content:space-between}}
.m1-chat{display:flex;flex-direction:column;gap:5px}
.m1-bubble{max-width:82%;border:1px solid var(--line);border-radius:14px;background:var(--surface);padding:6px 10px;animation:m1-pop .5s cubic-bezier(.2,.8,.2,1) both;transform-origin:0 100%}
.m1-bubble small{display:block;color:var(--bronze-light);font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.m1-bubble span{font-size:clamp(12px,1.5vw,16px);font-weight:600;line-height:1.2}.m1-bubble.right{align-self:flex-end;background:#c19a6322;border-color:#c19a6366;transform-origin:100% 100%}
.m1-bubble .m1-tr{color:var(--text-secondary);font-weight:500}
@keyframes m1-pop{from{opacity:0;transform:perspective(500px) rotateX(-55deg) translateY(10px) scale(.92)}to{opacity:1;transform:none}}
.m1-flip{perspective:700px;display:block;border:0;background:none;padding:0;width:100%;min-height:58px;height:100%}
.m1-flip-in{position:relative;display:block;width:100%;height:100%;min-height:inherit;transform-style:preserve-3d;transition:transform .6s cubic-bezier(.2,.8,.2,1)}
.m1-flip.on .m1-flip-in{transform:rotateY(180deg)}
.m1-face{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;gap:2px;text-align:left;border:1px solid var(--line);border-radius:10px;background:var(--surface);padding:5px 8px;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.m1-face.back{transform:rotateY(180deg);background:var(--surface-elevated);border-color:var(--bronze)}
.m1-face strong{font-size:clamp(12px,1.4vw,15px);font-weight:600;line-height:1.15}.m1-face small{color:var(--text-secondary);font-size:clamp(10px,1.1vw,12px);line-height:1.2}
.m1-flip:hover .m1-face{border-color:var(--bronze)}
.m1-trap .m1-face{min-height:72px}.m1-trap .bad strong{color:var(--warn)}.m1-trap .ok strong{color:var(--success)}
.m1-truck-stage{position:relative;width:100%;height:100%;user-select:none;pointer-events:none}
.m1-truck-run{--truck-start:clamp(67px,12%,124px);position:absolute;left:var(--truck-start);top:calc(50% - clamp(17px,2.8vw,28px));width:clamp(125px,20vw,205px);transform:translate(-50%,-50%);animation:m1-drive 14s linear infinite;filter:drop-shadow(0 8px 5px #0009)}
.m1-truck-run svg{display:block;width:100%;height:auto}
.m1-route-point{position:absolute;top:10px;z-index:2;padding:3px 7px;border:1px solid #d8b67899;border-radius:7px;background:#14191ddd;color:#e0c28c;font-size:clamp(9px,1vw,11px);font-weight:800;letter-spacing:.04em}
.m1-route-point.a{left:8px}.m1-route-point.b{right:8px}
@keyframes m1-drive{0%,7%{left:var(--truck-start);opacity:1}86%,92%{left:calc(100% - var(--truck-start));opacity:1}97%{opacity:0}100%{left:var(--truck-start);opacity:0}}
@media(prefers-reduced-motion:reduce){.m1-truck-run{animation:none;left:50%}}
.m1-svo-stage{perspective:900px;padding:8px 0}.m1-svo{display:flex;gap:8px;justify-content:center;transform-style:preserve-3d;transform:rotateX(14deg)}
.m1-tile{flex:1 1 0;max-width:210px;min-height:74px;border:0;border-radius:12px;padding:8px 10px;text-align:left;color:#0d1114;display:flex;flex-direction:column;justify-content:center;gap:2px;transition:transform .9s cubic-bezier(.2,.9,.2,1),opacity .6s;box-shadow:0 5px 0 #0009,0 14px 22px #0007;opacity:.85}
.m1-tile small{font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;opacity:.75}.m1-tile strong{font-size:clamp(14px,2vw,22px);line-height:1.1}
.m1-tile.t0{background:var(--bronze);transform:translate3d(-18px,-34px,-140px) rotateY(-38deg) rotateZ(-9deg)}.m1-tile.t1{background:var(--success);transform:translate3d(0,34px,90px) rotateX(48deg) rotateZ(4deg)}.m1-tile.t2{background:var(--ivory);transform:translate3d(18px,-30px,-70px) rotateY(42deg) rotateZ(8deg)}
.m1-svo.asm .m1-tile{transform:translateZ(0);opacity:1}.m1-svo.asm .m1-tile:hover{transform:translateZ(26px) translateY(-3px)}
.m1-root .m1-tile,.m1-root .m1-tile small,.m1-root .m1-tile strong{color:#172023}
.m1-pair{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:clamp(12px,2vw,22px);border:1px solid var(--line);border-radius:16px;background:linear-gradient(120deg,#c19a6312,#ffffff06)}
.m1-pair .m1-list{gap:9px}.m1-pair .m1-opt{min-height:56px}.m1-pair .m1-opt:disabled{opacity:1}.m1-pair .m1-opt.good:after{content:'✓';margin-left:auto;color:var(--success);font-size:19px}.m1-pair .m1-opt.bad{border-color:var(--warn);background:#6a282858}
.m1-pair-label{padding:0 4px 4px;color:var(--bronze-light);font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
@media(max-width:600px){.m1-pair{gap:6px;padding:8px}.m1-pair .m1-opt{min-height:64px;padding:6px}.m1-pair .m1-opt strong{font-size:11px}}
.m1-trio{border:1px solid var(--line);border-radius:10px;background:var(--surface);padding:7px 9px;display:grid;gap:3px;align-content:start}.m1-trio b{color:var(--bronze-light);font-size:12px;letter-spacing:.06em;text-transform:uppercase}.m1-trio span{font-size:clamp(11px,1.3vw,14px);font-weight:600;line-height:1.2}
.m1-chips{display:flex;gap:5px;flex-wrap:wrap}.m1-chip{min-height:34px;border:1px solid var(--line);border-radius:9px;background:var(--surface);padding:3px 9px;font-size:12px}.m1-chip.on{border-color:var(--bronze);background:var(--bronze);color:var(--background);font-weight:700}
.m1-slots{display:flex;gap:6px;flex-wrap:wrap;min-height:46px;align-items:center;border:1px dashed var(--line);border-radius:10px;padding:6px}.m1-token{min-height:44px;min-width:44px;border:1px solid var(--bronze);border-radius:9px;background:var(--surface-elevated);padding:4px 11px;font-weight:700;font-size:clamp(13px,1.6vw,17px);transition:transform .25s}
.m1-token:hover:not(:disabled){transform:translateZ(16px) translateY(-2px)}.m1-token.ghost{opacity:.28}
.m1-coin-wrap{display:grid;place-items:center;gap:6px;perspective:700px;padding:4px}.m1-coin{width:86px;height:86px;position:relative;transform-style:preserve-3d;animation:m1-coin 3.4s linear infinite}
.m1-coin i{position:absolute;inset:0;border-radius:50%;background:#8a6a3a;display:grid;place-items:center;font-style:normal;font-weight:800;font-size:24px;color:#0d1114}.m1-coin i.face{background:radial-gradient(circle at 30% 25%,var(--bronze-light),var(--bronze) 55%,#8a6a3a);border:3px solid #8a6a3a}
@keyframes m1-coin{to{transform:rotateY(360deg)}}
.m1-result-slide{max-width:1500px}.m1-result{width:100%;min-height:clamp(290px,55vh,560px);display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);align-items:center;gap:clamp(14px,3vw,48px);padding:clamp(16px,3vw,36px);border:1px solid #d8b67870;border-radius:24px;background:radial-gradient(circle at 22% 50%,#c19a6318,transparent 42%),linear-gradient(135deg,#2e3138,#1d2126);box-shadow:0 18px 40px #0005}
.m1-result-art{position:relative;min-height:clamp(210px,40vh,360px);display:grid;place-items:center;border-right:1px solid #d8b67844}
.m1-result-ring{position:relative;width:clamp(170px,28vh,250px);height:clamp(170px,28vh,250px);display:grid;place-items:center;border-radius:50%;background:conic-gradient(#e5c386 var(--score),#41464b 0);box-shadow:0 0 30px #c19a6333;animation:m1-result-pop .8s cubic-bezier(.2,.8,.2,1) both}
.m1-result-ring:before{content:'';position:absolute;inset:14px;border-radius:50%;background:#202329;box-shadow:inset 0 0 22px #0005}
.m1-result-score{position:relative;z-index:1;display:grid;text-align:center;line-height:1}.m1-result-score small{font-size:clamp(11px,1vw,15px);font-weight:800;letter-spacing:.12em;color:var(--bronze-light)}.m1-result-score strong{font-size:clamp(54px,7vw,90px);font-weight:800;color:#fff}
.m1-result-art .m1-coin-wrap{position:absolute;right:12%;bottom:6%;transform:scale(.56);transform-origin:center}.m1-result-art .m1-coin-wrap p{display:none}
.m1-result-copy{display:grid;justify-items:center;gap:clamp(8px,2vh,20px);text-align:center}.m1-result-copy svg{width:clamp(48px,6vw,78px);height:auto;color:#e0c28c}.m1-result-copy h2{margin:0;font-size:clamp(25px,3vw,44px);line-height:1.1}.m1-result-copy p{margin:0;max-width:460px;color:var(--text-secondary);font-size:clamp(13px,1.5vw,19px);line-height:1.5}.m1-result-copy b{color:var(--bronze-light);font-size:clamp(16px,1.9vw,25px)}
.m1-confetti{position:absolute;inset:0;overflow:hidden;pointer-events:none}.m1-confetti i{position:absolute;left:50%;top:50%;width:7px;height:13px;border-radius:2px;background:var(--bronze-light);transform:rotate(var(--angle)) translateY(-130px);animation:m1-confetti 3.8s ease-in-out infinite;animation-delay:var(--delay)}.m1-confetti i:nth-child(3n){background:#e4784f}.m1-confetti i:nth-child(4n){width:6px;height:6px;border-radius:50%}
@keyframes m1-confetti{0%,100%{opacity:0;transform:rotate(var(--angle)) translateY(-108px) scale(.6)}25%,75%{opacity:1}50%{transform:rotate(var(--angle)) translateY(-150px) scale(1)}}
@keyframes m1-result-pop{from{opacity:0;transform:scale(.76) rotate(-35deg)}to{opacity:1;transform:scale(1) rotate(0)}}
@media(max-width:600px){.m1-result{gap:8px;padding:12px;grid-template-columns:1fr}.m1-result-art{min-height:190px;border-right:0;border-bottom:1px solid #d8b67844}.m1-result-ring{width:160px;height:160px}.m1-result-ring:before{inset:11px}.m1-result-art .m1-coin-wrap{right:15%;bottom:0}.m1-result-copy{gap:6px}.m1-result-copy svg{width:36px}.m1-result-copy h2{font-size:22px}.m1-result-copy p{font-size:12px}}
.m1-phrase{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;align-items:center;border:1px solid var(--line);border-radius:10px;background:var(--surface);padding:4px 8px}
@media(max-width:600px){.m1-g4{grid-template-columns:repeat(2,minmax(0,1fr))}.m1-root{--ts:.78}.m1-bubble{max-width:90%}.m1-phrase{grid-template-columns:1fr}.m1-chip{min-height:32px}}
@media(max-height:700px){.m1-root{--ts:.74}.m1-panel{padding:7px}.m1-trap .m1-face{min-height:60px}}
/* Existing layout values; the shared palette below overrides visual colors. */
.m1-root{--background:#f3efe7;--surface:#fffaf2;--surface-elevated:#f8ead4;--foreground:#1b2429;--text-secondary:#59636a;--line:#876f5540;--success:#36754f;--warn:#9b542d;gap:clamp(6px,1vh,10px);background:radial-gradient(circle at 10% 9%,#e5cfac 0,transparent 35%),radial-gradient(circle at 90% 87%,#d9c49e 0,transparent 33%),#f3efe7}
.m1-head{max-width:none;min-height:54px;padding:8px 16px;border:1px solid #fff;border-radius:16px;background:rgba(255,255,255,.7);backdrop-filter:blur(8px);box-shadow:0 8px 28px #6f533719}
.m1-eyebrow,.m1-kick{color:#87572a}.m1-dot{background:#b9b8b3}.m1-dot.on{background:#b5864d}
.m1-body{max-width:none;justify-content:center;padding:clamp(10px,2vh,24px);border:1px solid #fff;border-radius:20px;background:rgba(255,255,255,.62);backdrop-filter:blur(8px);box-shadow:0 18px 42px #6f53371c}
.m1-slide{width:100%;max-width:980px;margin:auto;gap:clamp(6px,1.1vh,12px)}
.m1-foot{max-width:none;min-height:52px;padding:0 clamp(8px,2vw,24px);border-top:1px solid #b99b7847}
.m1-panel,.m1-opt,.m1-bubble,.m1-trio,.m1-face,.m1-phrase,.m1-chip,.m1-token,.m1-btn{background:rgba(255,255,255,.78);backdrop-filter:blur(5px);box-shadow:0 5px 15px #6f53370c}
.m1-opt:hover:not(:disabled),.m1-opt.sel,.m1-face.back{background:rgba(245,230,206,.92)}
.m1-opt.good{border-color:#71a382;background:#e8f3e9;animation:m1-correct .45s ease-out}
.m1-opt.bad{border-color:#c38263;background:#fbebe5;animation:m1-wrong .42s ease-out}
.m1-opt.good:after,.m1-opt.bad:after{margin-left:auto;font-size:19px;font-weight:800}
.m1-opt.good:after{content:'✓';color:#36754f}.m1-opt.bad:after{content:'×';color:#9b542d}
.m1-fb:not(:empty){padding:8px 11px;border:1px solid #b58c5c75;border-left:3px solid #b5864d;border-radius:10px;background:#fff7e9;color:#6f4c2b;font-weight:600}
.m1-fb.good{border-color:#75a688;background:#eaf4eb;color:#285e3c}.m1-fb.bad{border-color:#c48a69;background:#fff0e8;color:#8b462c}
.m1-btn.p,.m1-chip.on{background:linear-gradient(110deg,#e4c58e,#c5985f);color:#1b2429;border-color:#bd8f57}
.m1-btn.p:hover:not(:disabled){background:#e9cd9f}
.m1-link{color:#87572a}.m1-bubble small,.m1-trio b{color:#87572a}.m1-bubble.right{background:#f8ead4;border-color:#b78b5680}
.m1-face.back{border-color:#b5864d}.m1-trap .bad strong{color:#9b542d}.m1-trap .ok strong{color:#36754f}
.m1-mission-visual{position:relative;height:clamp(110px,20vh,185px);border:1px solid #c6a6778a;border-radius:16px;overflow:hidden;background:radial-gradient(circle at 50% 45%,#f8e9ce,transparent 65%),linear-gradient(125deg,#fffaf2,#eee0c8)}
.m1-route-canvas{position:absolute;inset:0;width:100%;height:100%;opacity:.7}
.m1-mission-visual .m1-truck-stage{position:relative;height:100%;z-index:1}
.m1-theory{display:grid;gap:clamp(7px,1.1vh,12px)}
.m1-theory-top{display:flex;align-items:center;justify-content:space-between;gap:8px}
.m1-theory-controls{display:flex;gap:5px}.m1-theory-controls button{border:1px solid #b5864d80;border-radius:8px;background:#fffaf2;padding:4px 8px;color:#82562a;font-size:clamp(10px,1vw,12px);font-weight:700}
.m1-live-hidden{visibility:hidden;opacity:0}.m1-theory-rule{min-height:2.8em}
.m1-type-caret{display:inline-block;width:2px;height:1em;margin-left:2px;background:#b5864d;vertical-align:-.15em;animation:m1-caret .75s step-end infinite}@keyframes m1-caret{50%{opacity:0}}
.m1-theory-rule{font-size:clamp(13px,1.55vw,16px);line-height:1.4;color:var(--foreground)}
.m1-theory-flow{display:flex;align-items:stretch;gap:6px;min-height:76px;padding:10px;border:1px solid #b78b5680;border-radius:14px;background:linear-gradient(110deg,#fffaf1,#f5e8d4);overflow:hidden}
.m1-theory-step{flex:1;min-width:0;display:grid;align-content:center;gap:3px;padding:7px 9px;border:1px solid #c7a476;border-radius:10px;background:#fffdfa;box-shadow:0 5px 12px #765a3618}.m1-theory-step.m1-live-enter{animation:m1-theory-build .65s cubic-bezier(.18,.8,.2,1) both}
.m1-theory-step small{font-size:clamp(9px,1.05vw,11px);color:#87572a;font-weight:750;text-transform:uppercase}.m1-theory-step strong{font-size:clamp(12px,1.5vw,17px);line-height:1.15;overflow-wrap:anywhere}
.m1-theory-arrow{align-self:center;color:#a5753d;font-size:18px;font-weight:800}.m1-theory-arrow.m1-live-enter{animation:m1-theory-arrow .55s ease both}
.m1-theory-points{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
.m1-theory-points p{padding:8px 10px;border:1px solid #c7a47666;border-radius:10px;background:#ffffffa8;color:#4d575a;font-size:clamp(11px,1.2vw,13px);line-height:1.3}.m1-theory-points p.m1-live-enter{animation:m1-theory-highlight .55s ease-out both}
.m1-theory-example{display:grid;gap:3px;padding:9px 12px;border-left:3px solid #b5864d;border-radius:9px;background:#ead8ba75}.m1-theory-example.m1-live-enter{animation:m1-theory-highlight .8s ease-out both}
.m1-theory-example strong{font-size:clamp(13px,1.65vw,18px)}.m1-theory-example span{color:#5b656b;font-size:clamp(11px,1.2vw,13px)}
.m1-theory-flip{display:block;width:100%;min-height:74px;border:0;background:none;padding:0;text-align:left;perspective:800px}.m1-theory-flip.m1-live-enter{animation:m1-theory-build .6s ease-out both}
.m1-theory-flip-inner{position:relative;display:block;min-height:74px;transform-style:preserve-3d;transition:transform .65s cubic-bezier(.2,.8,.2,1)}
.m1-theory-flip.on .m1-theory-flip-inner{transform:rotateX(180deg)}
.m1-theory-face{position:absolute;inset:0;display:grid;align-content:center;gap:3px;padding:8px 12px;border:1px solid #bd8f57;border-radius:10px;background:#fff7e9;backface-visibility:hidden;-webkit-backface-visibility:hidden;box-shadow:0 7px 16px #6f53371c}
.m1-theory-face small{color:#87572a;font-size:10px;font-weight:750;text-transform:uppercase;letter-spacing:.05em}.m1-theory-face strong{font-size:clamp(12px,1.45vw,16px)}.m1-theory-face em{font-size:clamp(10px,1.15vw,12px);font-style:normal;color:#59636a}
.m1-theory-face.back{transform:rotateX(180deg);border-color:#75a688;background:#eaf4eb}.m1-theory-face.back small{color:#285e3c}
.m1-trio.m1-live-enter,.m1-flip.m1-live-enter{animation:m1-theory-build .55s cubic-bezier(.18,.8,.2,1) both}
@keyframes m1-theory-build{from{opacity:0;transform:translate3d(-30px,14px,-70px) rotateY(-22deg)}to{opacity:1;transform:none}}
@keyframes m1-theory-arrow{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
@keyframes m1-theory-highlight{from{opacity:0;transform:scale(.95);box-shadow:0 0 0 0 #b5864d66}to{opacity:1;transform:none;box-shadow:0 0 0 5px #b5864d18}}
@keyframes m1-correct{50%{transform:translateZ(18px) scale(1.015);box-shadow:0 0 0 7px #7eae853b}}
@keyframes m1-wrong{25%{transform:translateX(-5px) rotateZ(-.4deg)}65%{transform:translateX(4px) rotateZ(.4deg)}}
@media(max-width:600px){.m1-root{padding:5px;gap:5px}.m1-head{min-height:45px;padding:5px 8px}.m1-body{padding:8px;border-radius:14px}.m1-foot{min-height:45px}.m1-mission-visual{height:100px}.m1-bubble{padding:4px 8px}.m1-chat{gap:3px}.m1-opt{min-height:40px;padding:5px 8px}.m1-slide{gap:5px}.m1-theory-flow{min-height:64px;padding:6px;gap:3px}.m1-theory-step{padding:5px}.m1-theory-arrow{font-size:13px}.m1-theory-points p{padding:6px}.m1-theory-rule{min-height:0}.m1-dot{width:6px}.m1-dots{gap:2px}.m1-eyebrow{font-size:10px}}
@media(max-height:600px){.m1-theory{gap:4px}.m1-theory-flow{min-height:56px}.m1-theory-flip,.m1-theory-flip-inner{min-height:62px}.m1-theory-points p{padding:4px 6px}.m1-theory-example{padding:5px 8px}}
@media(max-height:700px){.m1-mission-visual{height:100px}.m1-body{padding:4px 8px}.m1-slide{gap:4px}.m1-chat{gap:2px}.m1-bubble{padding:3px 8px}.m1-opt{min-height:38px}}
@media(prefers-reduced-motion:reduce){.m1-root *{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
/* Shared visual theme: color and surface only; slide geometry and motion stay above. */
.m1-root{--background:#0d1114;--surface:#20252a;--surface-elevated:#2c3035;--foreground:#f5f3ee;--text-secondary:#b8bbbd;--line:#c19a6359;--success:#80c796;--warn:#ed8985;background:radial-gradient(circle at 10% 9%,#9f713020,transparent 35%),radial-gradient(circle at 90% 87%,#a8793229,transparent 33%),#0d1114}
.m1-head,.m1-body{border-color:#d8b67866;background:linear-gradient(135deg,#30343bd9,#1b1f23ed 57%,#24282de8);box-shadow:0 18px 42px #0006,inset 0 1px #ffffff12}
.m1-title{color:#e0c28c}
.m1-eyebrow,.m1-kick,.m1-bubble small,.m1-trio b,.m1-link{color:#d8b678}.m1-dot{background:#454b4e}.m1-dot.on{background:#e0c28c}.m1-foot{border-color:#c19a6359}
.m1-panel,.m1-opt,.m1-bubble,.m1-trio,.m1-face,.m1-phrase,.m1-chip,.m1-token,.m1-btn{border-color:#c19a6359;background:#ffffff0b;color:#f5f3ee;box-shadow:0 5px 15px #0003}
.m1-opt:hover:not(:disabled),.m1-opt.sel,.m1-face.back{border-color:#d8b678;background:#c19a6326}.m1-opt.good{border-color:#68ab7e;background:#25593a55}.m1-opt.bad{border-color:#d77a79;background:#6a282858}.m1-opt.good:after,.m1-trap .ok strong{color:#80c796}.m1-opt.bad:after,.m1-trap .bad strong{color:#ed8985}
.m1-fb:not(:empty){border-color:#c19a6377;background:#c19a631f;color:#e0c28c}.m1-fb.good{border-color:#68ab7e;background:#25593a55;color:#9cddb5}.m1-fb.bad{border-color:#d77a79;background:#6a282858;color:#ffaaa7}
.m1-btn.p,.m1-chip.on{border-color:#d8b678;background:linear-gradient(110deg,#f0d39a,#c5985f);color:#17191a}.m1-btn.p:hover:not(:disabled){background:#f4dcae}.m1-bubble.right{border-color:#c19a6377;background:#c19a6324}
.m1-mission-visual{border-color:#d8b67880;background:radial-gradient(circle at 50% 45%,#c19a6328,transparent 65%),linear-gradient(125deg,#2b3034,#151a1d)}
.m1-theory-controls button{border-color:#d8b67888;background:#1b2024;color:#e0c28c}.m1-type-caret{background:#d8b678}.m1-theory-flow{border-color:#d8b67880;background:linear-gradient(110deg,#30343b,#1a1e22)}
.m1-theory-step{border-color:#c19a6388;background:#ffffff0b;box-shadow:0 5px 12px #0003}.m1-theory-step small,.m1-theory-arrow,.m1-theory-face small{color:#d8b678}
.m1-theory-points p{border-color:#c19a6359;background:#ffffff0b;color:#f5f3ee}.m1-theory-example{border-color:#d8b678;background:#c19a6324}.m1-theory-example span,.m1-theory-face em{color:#b8bbbd}
.m1-theory-face{border-color:#d8b678;background:#24292d;box-shadow:0 7px 16px #0004}.m1-theory-face.back{border-color:#68ab7e;background:#25593a}.m1-theory-face.back small{color:#9cddb5}
`;

const UI = {
  uz: { back: "Orqaga", next: "Davom etish", finish: "Darsni yakunlash", translation: "Tarjima", original: "Inglizcha", nextQ: "Keyingi", again: "Tozalash", hold: "Davom etish uchun vazifani bajaring", assemble: "Gapni yig'ish", scatter: "Qayta tarqatish", tapCards: "Kartalarni bosing.", rotate: "Aylantirish uchun suring", pickFirst: "Avval gapni tanlang.", firstTry: "birinchi urinishda", rate: { hard: "Qiyin", mid: "O'rtacha", easy: "Oson" }, done: "Dars yakunlandi", aloud: "Har iborani ovoz chiqarib o'qing va o'zingizni baholang.", resultTitle: "Natija", passed: "Ajoyib, o'tdingiz.", retake: "Natija 60% dan past: darsni qayta ko'rib chiqing.", tryAgain: "Boshqa variantni tanlang." },
  ru: { back: "Назад", next: "Далее", finish: "Завершить урок", translation: "Перевод", original: "English", nextQ: "Далее", again: "Очистить", hold: "Выполните задание, чтобы продолжить", assemble: "Собрать фразу", scatter: "Разобрать", tapCards: "Нажмите на карточки.", rotate: "Проведите, чтобы повернуть", pickFirst: "Сначала выберите фразу.", firstTry: "с первой попытки", rate: { hard: "Сложно", mid: "Средне", easy: "Легко" }, done: "Урок завершён", aloud: "Прочитайте каждую фразу вслух и оцените себя.", resultTitle: "Результат", passed: "Отлично, вы прошли.", retake: "Результат ниже 60%: повторите урок.", tryAgain: "Выберите другой вариант." },
  en: { back: "Back", next: "Continue", finish: "Finish lesson", translation: "Translation", original: "English", nextQ: "Next", again: "Clear", hold: "Complete the task to continue", assemble: "Assemble the sentence", scatter: "Scatter again", tapCards: "Tap the cards.", rotate: "Drag to rotate", pickFirst: "Pick a sentence first.", firstTry: "on the first try", rate: { hard: "Hard", mid: "Okay", easy: "Easy" }, done: "Lesson finished", aloud: "Read each phrase aloud and rate yourself.", resultTitle: "Result", passed: "Great, you passed.", retake: "Score is below 60%: review the lesson.", tryAgain: "Pick another option." },
};

const TITLES = ["Birinchi kun", "Dispatcher va Tom", "Uch xil gap", "Gapning tartibi", "be, have, need", "Savollar", "Tuzoqlar", "8 ta so'z", "Tekshirib ko'ramiz", "Gap tuzing", "Xatoni tuzating", "Brokerga javob bering", "Tezkor test", "Xulosa"];
const THEORY = [
  {
    title: { uz: "Gap qanday quriladi?", ru: "Как строится предложение?", en: "How is a sentence built?" },
    rule: { uz: "Darak gapda avval ega (kim yoki nima), keyin fe'l (harakat), undan keyin to'ldiruvchi keladi.", ru: "В утверждении сначала подлежащее, затем глагол и дополнение.", en: "In a statement, put the subject first, then the verb, then the object." },
    steps: [[{ uz: "Ega · kim?", ru: "Кто?", en: "Subject · who?" }, "The dispatcher"], [{ uz: "Fe'l · nima qiladi?", ru: "Глагол · что делает?", en: "Verb · action" }, "sends"], [{ uz: "To'ldiruvchi · nimani?", ru: "Что?", en: "Object · what?" }, "the address"]],
    points: [
      { uz: "Inglizchada odatiy darak tartibi: Subject + Verb + Object (SVO).", ru: "Обычный порядок: Subject + Verb + Object (SVO).", en: "The usual statement order is Subject + Verb + Object (SVO)." },
      { uz: "O'zbekchada fe'l ko'pincha oxirida; inglizchaga so'zma-so'z ko'chirmang.", ru: "В узбекском глагол часто в конце; не переносите этот порядок дословно.", en: "Uzbek often puts the verb last; do not copy that order into English." },
    ],
    example: "The dispatcher sends the address.", translation: { uz: "Dispetcher manzilni yuboradi.", ru: "Диспетчер отправляет адрес.", en: "The dispatcher sends the address." },
    wrong: "The dispatcher the address sends.", right: "The dispatcher sends the address.", why: { uz: "Fe'l egadan keyin turadi.", ru: "Глагол стоит после подлежащего.", en: "The verb follows the subject." },
  },
  {
    title: { uz: "be: am, is, are", ru: "be: am, is, are", en: "be: am, is, are" },
    rule: { uz: "Holat, kasb yoki joyni aytganda be fe'lining mos shakli kerak; uni tushirib qoldirmang.", ru: "Для состояния, профессии или места нужна форма be; её нельзя пропускать.", en: "Use a form of be for a state, job, or location; never omit it." },
    steps: [["I", "am"], ["he / she / it", "is"], ["you / we / they", "are"]],
    points: [
      { uz: "Bitta truck yoki load haqida: is. Ko'p truck haqida: are.", ru: "Один truck или load: is. Несколько truck: are.", en: "One truck or load takes is. Several trucks take are." },
      { uz: "be holatni bog'laydi: The load is ready; The driver is at the gate.", ru: "be связывает состояние: The load is ready; The driver is at the gate.", en: "be links a state: The load is ready; The driver is at the gate." },
    ],
    example: "The truck is ready.", translation: { uz: "Yuk mashinasi tayyor.", ru: "Грузовик готов.", en: "The truck is ready." },
    wrong: "The truck ready.", right: "The truck is ready.", why: { uz: "Birlikdagi truck uchun is shart.", ru: "Для truck в единственном числе нужно is.", en: "Singular truck needs is." },
  },
  {
    title: { uz: "have va need", ru: "have и need", en: "have and need" },
    rule: { uz: "have — bor/egalik; need — kerak. I/you/we/they bilan have, need; he/she/it bilan has, needs ishlatiladi.", ru: "have — иметь; need — нуждаться. С I/you/we/they: have, need; с he/she/it: has, needs.", en: "have means possession; need means necessity. Use have/need with I/you/we/they and has/needs with he/she/it." },
    steps: [["I / we / they", "have · need"], ["he / she / it", "has · needs"], [{ uz: "Ma'no", ru: "Значение", en: "Meaning" }, { uz: "bor · kerak", ru: "есть · нужно", en: "have · need" }]],
    points: [
      { uz: "We have a load — bizda yuk bor. We need a truck — bizga mashina kerak.", ru: "We have a load — у нас есть груз. We need a truck — нам нужен грузовик.", en: "We have a load = possession. We need a truck = necessity." },
      { uz: "Bitta broker uchun: The broker has a load; The broker needs a truck.", ru: "Для одного брокера: The broker has a load; The broker needs a truck.", en: "For one broker: The broker has a load; The broker needs a truck." },
    ],
    example: "The broker needs a truck.", translation: { uz: "Brokerga yuk mashinasi kerak.", ru: "Брокеру нужен грузовик.", en: "The broker needs a truck." },
    wrong: "The broker need a truck.", right: "The broker needs a truck.", why: { uz: "Bitta broker = he/she; fe'lga -s qo'shiladi.", ru: "Один broker = he/she; у глагола появляется -s.", en: "One broker = he/she, so the verb takes -s." },
  },
  {
    title: { uz: "Yes/No savollar", ru: "Вопросы Yes/No", en: "Yes/No questions" },
    rule: { uz: "Ha/yo'q savolida yordamchi so'z egadan oldin keladi. be bo'lsa am/is/are oldinga o'tadi; oddiy fe'lda do/does qo'shiladi.", ru: "В вопросе да/нет вспомогательный глагол стоит перед подлежащим: be переносится вперёд, для обычного глагола нужны do/does.", en: "In a yes/no question, put the helper before the subject: move be forward, or add do/does for an ordinary verb." },
    steps: [[{ uz: "be savoli", ru: "Вопрос с be", en: "Question with be" }, "Is"], [{ uz: "Ega", ru: "Подлежащее", en: "Subject" }, "the load"], [{ uz: "Holat", ru: "Состояние", en: "State" }, "ready?"]],
    points: [
      { uz: "Is the load ready? — be oldinga o'tdi. Do you have a load? — do qo'shildi.", ru: "Is the load ready? — be впереди. Do you have a load? — добавлено do.", en: "Is the load ready? moves be forward. Do you have a load? adds do." },
      { uz: "He/she/it bilan does ishlating va asosiy fe'lni oddiy shaklda qoldiring: Does he need it?", ru: "С he/she/it используйте does и начальную форму глагола: Does he need it?", en: "Use does with he/she/it and the base verb: Does he need it?" },
    ],
    example: "Does the broker need a truck?", translation: { uz: "Brokerga yuk mashinasi kerakmi?", ru: "Брокеру нужен грузовик?", en: "Does the broker need a truck?" },
    wrong: "Does the broker needs a truck?", right: "Does the broker need a truck?", why: { uz: "does da -s bor; need ga yana -s qo'shilmadi.", ru: "-s уже в does; к need его не добавляем.", en: "does already carries the -s; keep need in its base form." },
  },
  {
    title: { uz: "Wh-savollar", ru: "Wh-вопросы", en: "Wh-questions" },
    rule: { uz: "Ma'lumot so'raganda savol so'zi boshida turadi: What/Where/When/How much + yordamchi + ega. Keyin kerak bo'lsa fe'l keladi.", ru: "Для уточнения сначала идёт вопросительное слово: What/Where/When/How much + вспомогательный глагол + подлежащее.", en: "For information, start with What/Where/When/How much, then the helper and subject, followed by the main verb if needed." },
    steps: [[{ uz: "Savol so'zi", ru: "Вопросительное слово", en: "Question word" }, "Where"], [{ uz: "Yordamchi", ru: "Вспомогательный", en: "Helper" }, "is"], [{ uz: "Ega", ru: "Подлежащее", en: "Subject" }, "the shipper?"]],
    points: [
      { uz: "Where is the shipper? — joy. What is the weight? — narsa/miqdor.", ru: "Where is the shipper? — место. What is the weight? — предмет/вес.", en: "Where is the shipper? asks for a place. What is the weight? asks for a value." },
      { uz: "Oddiy fe'l bilan: When do you need the truck? Who ega bo'lsa: Who sends the address?", ru: "С обычным глаголом: When do you need the truck? Если Who — подлежащее: Who sends the address?", en: "With an ordinary verb: When do you need the truck? When Who is the subject: Who sends the address?" },
    ],
    example: "Where is the shipper?", translation: { uz: "Yuk jo'natuvchi qayerda?", ru: "Где отправитель?", en: "Where is the shipper?" },
    wrong: "Where the shipper is?", right: "Where is the shipper?", why: { uz: "be savolda egadan oldin turadi.", ru: "В вопросе be стоит перед подлежащим.", en: "In a question, be comes before the subject." },
  },
];
const ALL_TITLES = [...THEORY.map((rule) => rule.title.uz), ...TITLES];

const C = {
  s1: {
    kicker: "07:30 · Dispatcher",
    msg: "Hi, it's Tom. I'm at the yard. Do you have a load for me?",
    tr: { uz: "Salom, men Tomman. Yardda turibman. Menga yuk bormi?" },
    q: { uz: "Siz dispatchersiz. Qaysi javob to'g'ri?" },
    options: [
      { id: "A", text: "Yes, I have a load for you.", fb: { uz: "To'g'ri: fe'l (have) kim (I) dan keyin keldi." } },
      { id: "B", text: "Yes, a load I have for you.", fb: { uz: "Fe'l (have) egasi (I) dan ajralib qolgan, yuk oldinga chiqib ketgan." } },
      { id: "C", text: "Yes, have I a load for you.", fb: { uz: "Bu savol tartibi. Bu yerda javob (darak gap) kerak." } },
    ],
    answer: "A",
  },
  s2: {
    lines: [
      ["Tom", "Do you have a load for me?", "Menga yuk bormi?"],
      ["Dispatcher", "Yes. I have a load from Dallas to Atlanta.", "Ha. Dallasdan Atlantagacha yukim bor."],
      ["Tom", "What is the weight?", "Og'irligi qancha?"],
      ["Dispatcher", "The weight is 38,000 pounds.", "Og'irligi 38 000 funt."],
      ["Tom", "Where is the shipper?", "Shipper qayerda?"],
      ["Dispatcher", "The shipper is in Dallas. He opens at 7 AM.", "Shipper Dallasda. U ertalab 7 da ochiladi."],
      ["Tom", "Who is the broker?", "Broker kim?"],
      ["Dispatcher", "Mike from FastLoad. He sends the address now.", "FastLoad'dan Mayk. U manzilni hozir yuboradi."],
    ],
  },
  s3: {
    cats: [{ id: "st", t: { uz: "Darak gap" } }, { id: "wh", t: { uz: "Wh-savol" } }, { id: "yn", t: { uz: "Yes/No savol" } }],
    items: [
      { id: "a", en: "I have a load from Dallas to Atlanta.", cat: "st", fb: { uz: "To'g'ri: so'zsiz boshlanadi, kim (I) birinchi." } },
      { id: "b", en: "Where is the shipper?", cat: "wh", fb: { uz: "To'g'ri: Wh-so'z (Where) bilan boshlanadi." } },
      { id: "c", en: "Do you have a load for me?", cat: "yn", fb: { uz: "To'g'ri: yordamchi so'z (Do) bilan boshlanadi, javobi Yes/No." } },
    ],
    wrong: { uz: "Yana qarang: gap qaysi so'z bilan boshlanyapti?" },
  },
  s4: {
    text: { uz: "Ingliz gapida fe'l doim 2-o'rinda: kim → nima qiladi → kimni." },
    contrast: { uz: "O'zbekcha: Dispetcher haydovchiga qo'ng'iroq qiladi (fe'l oxirida). Inglizcha: The dispatcher calls the driver." },
    blocks: [{ en: "The dispatcher", label: { uz: "Kim" } }, { en: "calls", label: { uz: "Nima qiladi" } }, { en: "the driver", label: { uz: "Kimni" } }],
  },
  s5: {
    cols: [
      { k: "be", ex: ["The load is heavy.", "We are ready."] },
      { k: "have", ex: ["We have a new load."] },
      { k: "need", ex: ["They need a truck."] },
    ],
    note: { uz: "O'zbekcha «Yuk og'ir» deymiz, inglizchada is tushib qolmaydi: The load is heavy." },
    qs: [
      { id: "g1", en: "We ___ the BOL.", stem: { uz: "Bo'shliqni to'ldiring:" }, options: [{ id: "A", text: "have" }, { id: "B", text: "is" }, { id: "C", text: "are" }], answer: "A", fb: { A: { uz: "To'g'ri: 'ega bo'lmoq' = have." }, B: { uz: "is — holat. Bu yerda 'ega bo'lish' kerak, shuning uchun have." }, C: { uz: "are — holat. Bu yerda BOL bor/bo'lishi kerak: have." } } },
      { id: "g2", en: "The truck ___ ready.", stem: { uz: "Bo'shliqni to'ldiring:" }, options: [{ id: "A", text: "have" }, { id: "B", text: "is" }, { id: "C", text: "need" }], answer: "B", fb: { A: { uz: "have — 'ega bo'lmoq'. Holat uchun is kerak." }, B: { uz: "To'g'ri: holat = is, u tushib qolmaydi." }, C: { uz: "need — 'kerak'. 'Tayyor' holatini is bildiradi." } } },
    ],
  },
  s6: {
    formula: { uz: "Wh-so'z + is / do + kim / nima" },
    cards: [
      { w: "What", uz: "nima", ex: "What is the weight?" },
      { w: "Where", uz: "qayerda", ex: "Where is the shipper?" },
      { w: "Who", uz: "kim", ex: "Who is the broker?" },
      { w: "When", uz: "qachon", ex: "When do you need the truck?" },
      { w: "How much", uz: "qancha", ex: "How much is the rate?" },
    ],
    yn: "Yes/No: Do you have a load for me? · Is the load ready?",
  },
  s7: {
    pairs: [
      { bad: "The load heavy.", ok: "The load is heavy.", why: { uz: "is tushib qolmaydi." } },
      { bad: "Where you need to go?", ok: "Where do you need to go?", why: { uz: "Wh-so'zdan keyin do kerak." } },
      { bad: "Sends the broker the rate.", ok: "The broker sends the rate.", why: { uz: "Kim birinchi, fe'l ikkinchi." } },
    ],
  },
  s8: {
    words: [
      { en: "load", uz: "yuk", ex: "We have a new load today." },
      { en: "pickup", uz: "yukni olish (joyi/vaqti)", ex: "The pickup is at 8 AM." },
      { en: "delivery", uz: "yetkazib berish", ex: "The delivery is on Friday." },
      { en: "driver", uz: "haydovchi", ex: "The driver calls the broker." },
      { en: "broker", uz: "vositachi", ex: "The broker has the rate." },
      { en: "dispatcher", uz: "haydovchini yo'naltiruvchi", ex: "The dispatcher sends the address." },
      { en: "address", uz: "manzil", ex: "What is the address?" },
      { en: "weight", uz: "og'irlik", ex: "The weight is 20,000 pounds." },
    ],
  },
  s9: [
    { id: "q1", stem: { uz: "Qaysi gap to'g'ri?" }, options: [{ id: "A", text: "The dispatcher calls the driver." }, { id: "B", text: "Calls the dispatcher the driver." }, { id: "C", text: "The dispatcher the driver calls." }], answer: "A", fb: { A: { uz: "To'g'ri: kim → fe'l → kimni." }, B: { uz: "Fe'l oldinga chiqib ketgan: kim birinchi bo'lishi kerak." }, C: { uz: "Fe'l oxirida: bu o'zbekcha tartib." } } },
    { id: "q2", en: "___ is the delivery?", stem: { uz: "Javob: «In Atlanta.» Qaysi so'z kerak?" }, options: [{ id: "A", text: "Where" }, { id: "B", text: "Who" }, { id: "C", text: "How much" }], answer: "A", fb: { A: { uz: "To'g'ri: javob joy, demak Where." }, B: { uz: "Who — kim. Javob esa joy." }, C: { uz: "How much — qancha. Javob esa joy." } } },
    { id: "q3", en: "The weight ___ 38,000 pounds.", stem: { uz: "Bo'shliqni to'ldiring:" }, options: [{ id: "A", text: "is" }, { id: "B", text: "have" }, { id: "C", text: "needs" }], answer: "A", fb: { A: { uz: "To'g'ri: o'lcham/holat = is." }, B: { uz: "have bu yerda ma'no bermaydi: og'irlik 'ega bo'lmaydi'." }, C: { uz: "needs — 'kerak', bu yerda ma'no yo'q." } } },
  ],
  s10: [
    { words: ["the", "sends", "rate", "The", "broker"], answer: "The broker sends the rate", hint: { uz: "Tartib: kim → nima qiladi → nimani." } },
    { words: ["dispatcher", "?", "the", "Who", "is"], answer: "Who is the dispatcher ?", hint: { uz: "Savol: Wh-so'z → is → kim." } },
    { words: ["you", "What", "?", "need", "do"], answer: "What do you need ?", hint: { uz: "Savol: Wh-so'z → do → kim → fe'l." } },
  ],
  s11: [
    { id: "f1", en: "Where you need to go?", stem: { uz: "Xatoni tuzating:" }, options: [{ id: "A", text: "Where do you need to go?" }, { id: "B", text: "Where you do need to go?" }, { id: "C", text: "Do where you need to go?" }], answer: "A", fb: { A: { uz: "To'g'ri: Wh + do + kim + fe'l." }, B: { uz: "do egadan oldin turadi: Wh + do + you." }, C: { uz: "do savol boshida emas, Wh-so'zdan keyin." } } },
    { id: "f2", en: "The load heavy.", stem: { uz: "Xatoni tuzating:" }, options: [{ id: "A", text: "The load is heavy." }, { id: "B", text: "The load are heavy." }, { id: "C", text: "The load be heavy." }], answer: "A", fb: { A: { uz: "To'g'ri: is tushib qolmaydi." }, B: { uz: "load — birlik, are emas." }, C: { uz: "be bu shaklda ishlatilmaydi: is kerak." } } },
    { id: "f3", en: "Sends the broker the rate.", stem: { uz: "Xatoni tuzating:" }, options: [{ id: "A", text: "The broker sends the rate." }, { id: "B", text: "The broker the rate sends." }, { id: "C", text: "Broker the sends rate." }], answer: "A", fb: { A: { uz: "To'g'ri: kim → fe'l → nimani." }, B: { uz: "Fe'l oxirida: o'zbekcha tartib." }, C: { uz: "So'zlar aralashib ketgan." } } },
  ],
  s12: [
    { id: "r1", ctx: ["Mike · Broker", "Hi, I need a truck from Dallas to Atlanta. Do you have one?"], stem: { uz: "Javob bering:" }, options: [{ id: "A", text: "Yes, I have a truck. What is the weight?" }, { id: "B", text: "Yes, a truck I have. Weight what?" }, { id: "C", text: "Yes. Is weight what?" }], answer: "A", fb: { A: { uz: "Aniq va professional." }, B: { uz: "Mike tushunadi, lekin tartib buzilgan: u qayta so'raydi." }, C: { uz: "Savol tartibi buzilgan: Mike nima so'ralganini bilmaydi." } } },
    { id: "r2", ctx: ["Mike · Broker", "The weight is 38,000 pounds."], stem: { uz: "Shipper qayerdaligini so'rang:" }, options: [{ id: "A", text: "Where is the shipper?" }, { id: "B", text: "Where the shipper is?" }, { id: "C", text: "The shipper where?" }], answer: "A", fb: { A: { uz: "To'g'ri: Where + is + kim." }, B: { uz: "is egadan oldin turishi kerak." }, C: { uz: "Savol so'zi gap boshida bo'ladi." } } },
    { id: "r3", ctx: ["Mike · Broker", "The shipper is in Dallas. He opens at 7 AM."], stem: { uz: "Narxni so'rang:" }, options: [{ id: "A", text: "How much is the rate?" }, { id: "B", text: "How much the rate is?" }, { id: "C", text: "The rate how much?" }], answer: "A", fb: { A: { uz: "To'g'ri. Siz 3 ta ma'lumotni oldingiz: weight, shipper, rate." }, B: { uz: "is egadan oldin turadi." }, C: { uz: "Savol so'zi gap boshida bo'ladi." } } },
  ],
  s13: [
    { id: "t1", stem: { uz: "To'g'ri gap:" }, options: [{ id: "A", text: "We need a new truck." }, { id: "B", text: "We a new truck need." }, { id: "C", text: "Need we a new truck." }], answer: "A", fb: { A: { uz: "Kim → fe'l → nima." }, B: { uz: "Fe'l oxirida: o'zbekcha tartib." }, C: { uz: "Fe'l oldinga chiqib ketgan." } } },
    { id: "t2", stem: { uz: "To'g'ri savol:" }, options: [{ id: "A", text: "Where is the driver now?" }, { id: "B", text: "Where the driver is now?" }, { id: "C", text: "Is where the driver now?" }], answer: "A", fb: { A: { uz: "Wh-so'z → is → kim." }, B: { uz: "is egadan oldin turadi." }, C: { uz: "Wh-so'z birinchi bo'ladi." } } },
    { id: "t3", en: "The truck ___ ready.", stem: { uz: "Bo'shliqni to'ldiring:" }, options: [{ id: "A", text: "are" }, { id: "B", text: "is" }, { id: "C", text: "(hech narsa)" }], answer: "B", fb: { A: { uz: "truck — birlik, are emas." }, B: { uz: "truck birlik, is tushmaydi." }, C: { uz: "Inglizchada is tushib qolmaydi." } } },
    { id: "t4", stem: { uz: "Og'irlikni so'rang:" }, options: [{ id: "A", text: "What is the weight?" }, { id: "B", text: "Who is the weight?" }, { id: "C", text: "When is the weight?" }], answer: "A", fb: { A: { uz: "Narsani so'rayapsiz: What." }, B: { uz: "Who — kim. Og'irlik esa narsa." }, C: { uz: "When — qachon. Og'irlik vaqt emas." } } },
  ],
  s14: ["I have a load for you.", "What is the weight?", "Where is the shipper?", "Who is the broker?", "Do you need the address?", "How much is the rate?"],
};

const tx = (v, lang) => (typeof v === "string" ? v : v?.[lang] || v?.uz || "");
const letters = "ABCDEFG";
const THEORY_UI = {
  uz: { lesson: "Nazariya", wrong: "Noto'g'ri tartib yoki shakl", reveal: "To'g'ri shaklni ko'rish", right: "To'g'ri shakl" },
  ru: { lesson: "Теория", wrong: "Неверный порядок или форма", reveal: "Показать верную форму", right: "Верная форма" },
  en: { lesson: "Theory", wrong: "Incorrect order or form", reveal: "Show the correct form", right: "Correct form" },
};

/* ---------- Dallas to Atlanta: detailed side-view semi truck ---------- */
function Truck() {
  return <div className="m1-truck-stage" aria-hidden="true">
    <span className="m1-route-point a">A · Dallas</span>
    <span className="m1-route-point b">B · Atlanta</span>
    <div className="m1-truck-run">
      <svg viewBox="0 0 320 135" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="m1-trailer" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#f4e8d2"/><stop offset=".18" stopColor="#cbb997"/><stop offset=".72" stopColor="#a78e69"/><stop offset="1" stopColor="#6c5a43"/></linearGradient>
          <linearGradient id="m1-cab" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f4d59e"/><stop offset=".38" stopColor="#c3985c"/><stop offset="1" stopColor="#715235"/></linearGradient>
          <linearGradient id="m1-glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#7f9caa"/><stop offset=".4" stopColor="#263a46"/><stop offset="1" stopColor="#101b22"/></linearGradient>
          <radialGradient id="m1-tyre"><stop offset=".3" stopColor="#626a70"/><stop offset=".34" stopColor="#b8b9b4"/><stop offset=".49" stopColor="#41494e"/><stop offset=".52" stopColor="#11171b"/><stop offset=".9" stopColor="#11171b"/><stop offset="1" stopColor="#41474b"/></radialGradient>
        </defs>
        <ellipse cx="161" cy="119" rx="150" ry="9" fill="#000" opacity=".3"/>
        <path d="M22 21h204v79H22z" fill="url(#m1-trailer)" stroke="#5f5040" strokeWidth="2"/>
        <path d="M22 21h204v8H22z" fill="#f5e8d2" opacity=".8"/><path d="M22 91h204v9H22z" fill="#534a3d"/>
        <path d="M30 30h186M30 83h186" stroke="#f1e6d2" strokeWidth="1.5" opacity=".55"/>
        <path d="M55 28v62m40-62v62m40-62v62m40-62v62m40-62v62" stroke="#655744" strokeWidth="1.3" opacity=".3"/>
        <text x="113" y="63" textAnchor="middle" fill="#443c32" fontSize="14" fontWeight="800" letterSpacing="1.2">COLISEUM</text>
        <text x="113" y="76" textAnchor="middle" fill="#5a4b35" fontSize="7" fontWeight="700" letterSpacing="3">LOGISTICS</text>
        <path d="M10 101h218v9H10z" fill="#2b3338" stroke="#151b1e" strokeWidth="2"/>
        <path d="M33 101v14m68-14v14m116-14v14" stroke="#a9a9a2" strokeWidth="2"/>
        <path d="M229 55h37l14 11 19 3 10 15v24h-82z" fill="url(#m1-cab)" stroke="#5b4732" strokeWidth="2"/>
        <path d="M229 56h31v32h-31z" fill="url(#m1-glass)" stroke="#d7c7a9" strokeWidth="2"/>
        <path d="M265 59l12 9 13 2 7 17h-32z" fill="url(#m1-glass)" stroke="#c7af83" strokeWidth="2"/>
        <path d="M232 61l22-3-17 25h-5zM269 67l11 3-11 13z" fill="#d5e2e5" opacity=".22"/>
        <path d="M230 91h68M266 87v17" stroke="#634932" strokeWidth="2"/>
        <path d="M267 93h9" stroke="#e5c797" strokeWidth="2" strokeLinecap="round"/>
        <path d="M308 84h7v19h-7z" fill="#2d3539" stroke="#a3a39b"/>
        <path d="M308 90h6v7h-6z" fill="#ffe0a2"/>
        <path d="M231 98h5v6h-5z" fill="#d9563c"/>
        <path d="M241 55V37h5v18" fill="#626c6d" stroke="#323638" strokeWidth="1.5"/>
        <path d="M263 67l-4-3v7" fill="none" stroke="#222a2d" strokeWidth="2"/>
        <path d="M229 106h85v6h-85z" fill="#b4aaa0" stroke="#41494c" strokeWidth="1.5"/>
        <path d="M239 107h24l-5 5h-19z" fill="#363d40"/>
        {[47,90,248,289].map((x) => <g key={x}><circle cx={x} cy="111" r="17" fill="url(#m1-tyre)" stroke="#0c1013" strokeWidth="2"/><circle cx={x} cy="111" r="5" fill="#c6c9c5" stroke="#525b5e"/><circle cx={x} cy="111" r="2" fill="#687075"/></g>)}
        <path d="M24 21h202v79" fill="none" stroke="#fff7e5" opacity=".42"/>
      </svg>
    </div>
  </div>;
}

/* ---------- small pieces ---------- */
const Bubble = ({ who, text, side = "left", delay = 0, muted }) => (
  <div className={`m1-bubble ${side}`} style={{ animationDelay: delay + "ms" }}>
    {who && <small>{who}</small>}
    <span className={muted ? "m1-tr" : ""}>{text}</span>
  </div>
);

function Flip({ on, onFlip, front, back, className = "" }) {
  return (
    <button type="button" className={`m1-flip ${className} ${on ? "on" : ""}`} aria-pressed={on} onClick={onFlip}>
      <span className="m1-flip-in"><span className="m1-face">{front}</span><span className="m1-face back">{back}</span></span>
    </button>
  );
}

function useFlips(n, onAll) {
  const [on, setOn] = useState(() => Array(n).fill(false));
  const [seen, setSeen] = useState(() => Array(n).fill(false));
  useEffect(() => { if (seen.every(Boolean)) onAll(); }, [seen]); // eslint-disable-line
  const toggle = (i) => { setOn((p) => p.map((v, k) => (k === i ? !v : v))); setSeen((p) => p.map((v, k) => (k === i ? true : v))); };
  return [on, toggle];
}

const Coin = ({ text, sub }) => (
  <div className="m1-coin-wrap">
    <div className="m1-coin">
      {[-3, -1.5, 0, 1.5, 3].map((z) => <i key={z} style={{ transform: `translateZ(${z}px)` }} />)}
      <i className="face" style={{ transform: "translateZ(4px)" }}>{text}</i>
      <i className="face" style={{ transform: "rotateY(180deg) translateZ(4px)" }}>{text}</i>
    </div>
    <p className="m1-muted">{sub}</p>
  </div>
);

/* ---------- Quiz (guided / fix / role-play / rapid) ---------- */
function Quiz({ qs, lang, ui, retry = true, seed = 0, onDone, finishView }) {
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [st, setSt] = useState("idle");
  const [fin, setFin] = useState(null);
  const first = useRef({});
  const q = qs[i];
  const shift = (i + seed) % q?.options.length || 0;
  const opts = q ? [...q.options.slice(shift), ...q.options.slice(0, shift)] : [];
  const choose = (o) => {
    if (st === "good" || (!retry && st === "bad")) return;
    const ok = o.id === q.answer;
    if (first.current[q.id] === undefined) first.current[q.id] = ok;
    setPick(o.id); setSt(ok ? "good" : "bad");
  };
  const next = () => {
    if (i + 1 < qs.length) { setI(i + 1); setPick(null); setSt("idle"); return; }
    const correct = Object.values(first.current).filter(Boolean).length;
    const res = { firstTry: correct, total: qs.length };
    setFin(res); onDone(res);
  };
  if (fin) return finishView ? finishView(fin) : <p className="m1-fb good">✓ {fin.firstTry}/{fin.total} {ui.firstTry}</p>;
  const canNext = st === "good" || (!retry && st === "bad");
  return (
    <div className="m1-list">
      <span className="m1-kick">{i + 1} / {qs.length}</span>
      {q.ctx && <Bubble who={q.ctx[0]} text={q.ctx[1]} />}
      {q.stem && <p className="m1-sub">{tx(q.stem, lang)}</p>}
      {q.en && <p className="m1-en">{q.en}</p>}
      <div className="m1-list">
        {opts.map((o, k) => (
          <button key={o.id} type="button" className={`m1-opt ${pick === o.id ? (st === "good" ? "good" : "bad") : ""}`} onClick={() => choose(o)} disabled={st === "good" && pick !== o.id}>
            <span className="k">{letters[k]}</span><strong>{tx(o.text, lang)}</strong>
          </button>
        ))}
      </div>
      <p className={`m1-fb ${st === "good" ? "good" : st === "bad" ? "bad" : ""}`} aria-live="polite">{pick ? tx(q.fb[pick], lang) + (st === "bad" && retry ? " " + ui.tryAgain : "") : ""}</p>
      <button type="button" className="m1-btn p" disabled={!canNext} onClick={next} style={{ justifySelf: "end" }}>{ui.nextQ} →</button>
    </div>
  );
}

/* ---------- slides ---------- */
function TypedText({ text, active, instant = false, speed = 18 }) {
  const [length, setLength] = useState(0);
  const showAll = instant || (typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    if (!active || showAll) return;
    let next = 0;
    const timer = setInterval(() => { next += 1; setLength(next); if (next >= text.length) clearInterval(timer); }, speed);
    return () => clearInterval(timer);
  }, [text, active, showAll, speed]);
  const visibleLength = showAll ? text.length : length;
  return <span aria-label={active ? text : undefined}><span aria-hidden="true">{text.slice(0, visibleLength)}</span>{active && visibleLength < text.length && <i className="m1-type-caret" aria-hidden="true" />}</span>;
}

function useCascade(total, interval = 400, start = 0) {
  const [shown, setShown] = useState(0);
  const reduceMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  useEffect(() => {
    if (reduceMotion) return;
    const timers = Array.from({ length: total }, (_, index) => setTimeout(() => setShown(index + 1), start + index * interval));
    return () => timers.forEach(clearTimeout);
  }, [total, interval, start, reduceMotion]);
  return reduceMotion ? total : shown;
}

function TheorySlide({ index, lang, setGate }) {
  const rule = THEORY[index];
  const labels = THEORY_UI[lang];
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState(0);
  const [run, setRun] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const ruleText = tx(rule.rule, lang);
  const pointTexts = rule.points.map((point) => tx(point, lang));
  const translation = tx(rule.translation, lang);
  const reduceMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const visiblePhase = skipped || reduceMotion ? 8 : phase;
  useEffect(() => {
    if (skipped || reduceMotion) return;
    const timers = [];
    let at = ruleText.length * 18 + 180;
    for (let step = 1; step <= rule.steps.length; step += 1) {
      timers.push(setTimeout(() => setPhase(step), at));
      at += 470;
    }
    pointTexts.forEach((point, pointIndex) => {
      timers.push(setTimeout(() => setPhase(4 + pointIndex), at));
      at += point.length * 14 + 170;
    });
    timers.push(setTimeout(() => setPhase(6), at));
    at += rule.example.length * 18 + 160;
    timers.push(setTimeout(() => setPhase(7), at));
    at += translation.length * 18 + 220;
    timers.push(setTimeout(() => setPhase(8), at));
    return () => timers.forEach(clearTimeout);
  }, [index, lang, run, skipped, reduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps
  const motion = (visible) => visible ? "m1-live-enter" : "m1-live-hidden";
  return <div className="m1-theory">
    <div className="m1-theory-top"><span className="m1-kick">{labels.lesson} · {index + 1}/5</span><div className="m1-theory-controls">
      <button type="button" onClick={() => { setPhase(0); setRevealed(false); setSkipped(false); setRun((value) => value + 1); }}>{lang === "ru" ? "Повтор" : lang === "en" ? "Replay" : "Qayta"}</button>
      <button type="button" onClick={() => setSkipped(true)} disabled={visiblePhase === 8}>{lang === "ru" ? "Показать всё" : lang === "en" ? "Show all" : "Hammasi"}</button>
    </div></div>
    <h1 className="m1-title">{tx(rule.title, lang)}</h1>
    <p className="m1-theory-rule"><TypedText key={`rule-${run}`} text={ruleText} active instant={skipped} /></p>
    <div className="m1-theory-flow" aria-label={visiblePhase >= 3 ? rule.steps.map((step) => tx(step[1], lang)).join(" → ") : undefined}>
      {rule.steps.map(([label, word], step) => <React.Fragment key={step}>
        {step > 0 && <span className={`m1-theory-arrow ${motion(visiblePhase >= step + 1)}`} aria-hidden="true">→</span>}
        <div className={`m1-theory-step ${motion(visiblePhase >= step + 1)}`} aria-hidden={visiblePhase < step + 1}><small>{tx(label, lang)}</small><strong>{tx(word, lang)}</strong></div>
      </React.Fragment>)}
    </div>
    <div className="m1-theory-points">{pointTexts.map((point, pointIndex) => <p key={pointIndex} className={motion(visiblePhase >= 4 + pointIndex)} aria-hidden={visiblePhase < 4 + pointIndex}><TypedText key={`point-${run}-${pointIndex}`} text={point} active={visiblePhase >= 4 + pointIndex} instant={skipped} speed={14} /></p>)}</div>
    <div className={`m1-theory-example ${motion(visiblePhase >= 6)}`} aria-hidden={visiblePhase < 6}><strong><TypedText key={`example-${run}`} text={rule.example} active={visiblePhase >= 6} instant={skipped} /></strong><span><TypedText key={`translation-${run}`} text={translation} active={visiblePhase >= 7} instant={skipped} /></span></div>
    <button type="button" className={`m1-theory-flip ${motion(visiblePhase >= 8)} ${revealed ? "on" : ""}`} disabled={visiblePhase < 8} aria-hidden={visiblePhase < 8} aria-pressed={revealed} onClick={() => { setRevealed(true); setGate(); }}>
      <span className="m1-theory-flip-inner">
        <span className="m1-theory-face"><small>{labels.wrong} · {labels.reveal}</small><strong>{rule.wrong}</strong></span>
        <span className="m1-theory-face back"><small>{labels.right} ✓</small><strong>{rule.right}</strong><em>{tx(rule.why, lang)}</em></span>
      </span>
    </button>
  </div>;
}

function S1({ lang, ui, setGate, rec }) {
  const d = C.s1; const [pick, setPick] = useState(null); const [tr, setTr] = useState(false);
  return (<>
    <span className="m1-kick">{d.kicker}</span>
    <div className="m1-mission-visual"><RiveRoute className="m1-route-canvas" /><Truck /></div>
    <p className="m1-muted" style={{ textAlign: "center" }}>{lang === "ru" ? "Грузовик едет из Далласа в Атланту" : lang === "en" ? "The truck is driving from Dallas to Atlanta" : "Yuk mashinasi Dallasdan Atlantaga ketmoqda"}</p>
    <Bubble who="Tom · Driver" text={tr ? tx(d.tr, lang) : d.msg} muted={tr} />
    <button type="button" className="m1-link" onClick={() => setTr(!tr)}>{ui.translation}</button>
    <p className="m1-sub">{tx(d.q, lang)}</p>
    <div className="m1-list">{d.options.map((o, k) => (
      <button key={o.id} type="button" className={`m1-opt ${pick === o.id ? (o.id === d.answer ? "good" : "bad") : ""}`} onClick={() => { setPick(o.id); rec("s1", o.id === d.answer); setGate(); }}>
        <span className="k">{letters[k]}</span><strong>{o.text}</strong></button>))}</div>
    <p className={`m1-fb ${pick ? (pick === d.answer ? "good" : "bad") : ""}`}>{pick ? tx(d.options.find((o) => o.id === pick).fb, lang) : ""}</p>
  </>);
}

function S2({ ui, setGate }) {
  const [tr, setTr] = useState(false);
  useEffect(() => { setGate(); }, []); // eslint-disable-line
  return (<>
    <h1 className="m1-title">{TITLES[1]}</h1>
    <div className="m1-chat">{C.s2.lines.map(([who, en, uz], k) => (
      <Bubble key={k} who={who} text={tr ? uz : en} muted={tr} side={who === "Tom" ? "left" : "right"} delay={k * 220} />))}</div>
    <button type="button" className="m1-link" onClick={() => setTr(!tr)}>{tr ? ui.original : ui.translation}</button>
  </>);
}

function S3({ lang, ui, setGate }) {
  const d = C.s3; const [sel, setSel] = useState(null); const [done, setDone] = useState({}); const [fb, setFb] = useState(null); const [attempt, setAttempt] = useState(null);
  const [cats] = useState(() => {
    const shift = 1 + Math.floor(Math.random() * (d.cats.length - 1));
    return [...d.cats.slice(shift), ...d.cats.slice(0, shift)];
  });
  const cat = (cid) => {
    if (!sel) { setFb({ t: ui.pickFirst, bad: true }); return; }
    const s = d.items.find((x) => x.id === sel);
    if (s.cat === cid) { setDone((p) => ({ ...p, [sel]: cid })); setFb({ t: tx(s.fb, lang), good: true }); setSel(null); setAttempt(null); }
    else { setAttempt(cid); setFb({ t: tx(d.wrong, lang), bad: true }); }
  };
  useEffect(() => { if (Object.keys(done).length === d.items.length) setGate(); }, [done]); // eslint-disable-line
  return (<>
    <h1 className="m1-title">{TITLES[2]}</h1>
    <p className="m1-sub">Gapni, so&apos;ng uning turini bosing.</p>
    <div className="m1-pair">
      <div className="m1-list"><span className="m1-pair-label">{lang === "ru" ? "Предложения" : lang === "en" ? "Sentences" : "Gaplar"}</span>{d.items.map((s) => (
        <button key={s.id} type="button" className={`m1-opt ${done[s.id] ? "good" : sel === s.id ? "sel" : ""}`} disabled={!!done[s.id]} aria-pressed={sel === s.id} onClick={() => { setSel(s.id); setAttempt(null); }}><strong>{s.en}</strong></button>))}</div>
      <div className="m1-list"><span className="m1-pair-label">{lang === "ru" ? "Тип" : lang === "en" ? "Type" : "Gap turi"}</span>{cats.map((c) => (
        <button key={c.id} type="button" className={`m1-opt ${Object.values(done).includes(c.id) ? "good" : attempt === c.id ? "bad" : ""}`} disabled={Object.values(done).includes(c.id)} onClick={() => cat(c.id)}><strong>{tx(c.t, lang)}</strong></button>))}</div>
    </div>
    <p className={`m1-fb ${fb?.good ? "good" : fb?.bad ? "bad" : ""}`} aria-live="polite">{fb?.t || ""}</p>
  </>);
}

function S4({ lang, ui, setGate }) {
  const d = C.s4; const [asm, setAsm] = useState(false);
  useEffect(() => { if (asm) setGate(); }, [asm]); // eslint-disable-line
  return (<>
    <h1 className="m1-title">{TITLES[3]}</h1>
    <p className="m1-sub"><TypedText text={tx(d.text, lang)} active /></p>
    <div className="m1-svo-stage" onPointerDown={() => setAsm(true)}><div className={`m1-svo ${asm ? "asm" : ""}`}>
      {d.blocks.map((b, k) => <button type="button" key={k} className={`m1-tile t${k}`} onClick={() => setAsm(true)}><small>{tx(b.label, lang)}</small><strong>{b.en}</strong></button>)}
    </div></div>
    <button type="button" className="m1-btn p" style={{ justifySelf: "center", alignSelf: "center" }} onClick={() => setAsm(!asm)}>{asm ? ui.scatter : ui.assemble}</button>
    <p className="m1-muted"><TypedText key={`contrast-${asm}`} text={tx(d.contrast, lang)} active={asm} /></p>
  </>);
}

function S5({ lang, ui, setGate }) {
  const d = C.s5;
  const shown = useCascade(d.cols.length, 500, 300);
  return (<>
    <h1 className="m1-title">{TITLES[4]}</h1>
    <div className="m1-grid m1-g3">{d.cols.map((c, index) => <div className={`m1-trio ${shown > index ? "m1-live-enter" : "m1-live-hidden"}`} aria-hidden={shown <= index} key={c.k}><b>{c.k}</b>{c.ex.map((e) => <span key={e}>{e}</span>)}</div>)}</div>
    <p className="m1-muted"><TypedText text={tx(d.note, lang)} active={shown === d.cols.length} /></p>
    <Quiz qs={d.qs} lang={lang} ui={ui} onDone={() => setGate()} seed={1} />
  </>);
}

function S6({ lang, ui, setGate }) {
  const d = C.s6; const [on, toggle] = useFlips(d.cards.length, setGate);
  const formula = tx(d.formula, lang);
  const shown = useCascade(d.cards.length, 290, formula.length * 18 + 150);
  return (<>
    <h1 className="m1-title">{TITLES[5]}</h1>
    <p className="m1-en"><TypedText text={formula} active /></p>
    <p className="m1-sub">{ui.tapCards}</p>
    <div className="m1-grid m1-g3">{d.cards.map((c, k) => (
      <Flip key={c.w} className={shown > k ? "m1-live-enter" : "m1-live-hidden"} on={on[k]} onFlip={() => toggle(k)} front={<strong>{c.w}</strong>} back={<><strong>{c.uz}</strong><small>{c.ex}</small></>} />))}</div>
    <p className="m1-muted">{d.yn}</p>
  </>);
}

function S7({ lang, ui, setGate }) {
  const d = C.s7; const [on, toggle] = useFlips(d.pairs.length, setGate);
  const shown = useCascade(d.pairs.length, 410, 350);
  return (<>
    <h1 className="m1-title">{TITLES[6]}</h1>
    <p className="m1-sub"><TypedText text={`O'zbekchadan o'tib ketadigan xatolar. ${ui.tapCards}`} active /></p>
    <div className="m1-list m1-trap">{d.pairs.map((p, k) => (
      <Flip key={k} className={shown > k ? "m1-live-enter" : "m1-live-hidden"} on={on[k]} onFlip={() => toggle(k)} front={<span className="bad"><small>✗</small><strong>{p.bad}</strong></span>} back={<span className="ok"><small>✓ {tx(p.why, lang)}</small><strong>{p.ok}</strong></span>} />))}</div>
  </>);
}

function S8({ ui, setGate }) {
  const d = C.s8; const [on, toggle] = useFlips(d.words.length, setGate);
  return (<>
    <h1 className="m1-title">{TITLES[7]}</h1>
    <p className="m1-sub">{ui.tapCards}</p>
    <div className="m1-grid m1-g4">{d.words.map((w, k) => (
      <Flip key={w.en} on={on[k]} onFlip={() => toggle(k)} front={<strong>{w.en}</strong>} back={<><strong>{w.uz}</strong><small>{w.ex}</small></>} />))}</div>
  </>);
}

const QuizSlide = ({ idx, qs, lang, ui, setGate, rec, tag, seed, retry = true, finishView }) => (<>
  <h1 className="m1-title">{TITLES[idx]}</h1>
  <Quiz qs={qs} lang={lang} ui={ui} seed={seed} retry={retry} finishView={finishView} onDone={(r) => { rec(tag, r); setGate(); }} />
</>);

function S10({ lang, ui, setGate, rec }) {
  const items = C.s10; const [k, setK] = useState(0); const [pick, setPick] = useState([]); const [st, setSt] = useState("idle"); const [fin, setFin] = useState(null);
  const first = useRef({}); const it = items[k];
  if (fin) return (<><h1 className="m1-title">{TITLES[9]}</h1><p className="m1-fb good">✓ {fin.firstTry}/{fin.total} {ui.firstTry}</p></>);
  const add = (wi) => {
    if (st === "good" || pick.includes(wi)) return;
    const next = [...pick, wi]; setPick(next); setSt("idle");
    if (next.length === it.words.length) {
      const ok = next.map((x) => it.words[x]).join(" ") === it.answer;
      if (first.current[k] === undefined) first.current[k] = ok;
      setSt(ok ? "good" : "bad");
    }
  };
  const go = () => {
    if (k + 1 < items.length) { setK(k + 1); setPick([]); setSt("idle"); return; }
    const r = { firstTry: Object.values(first.current).filter(Boolean).length, total: items.length }; setFin(r); rec("build", r); setGate();
  };
  return (<>
    <h1 className="m1-title">{TITLES[9]}</h1>
    <span className="m1-kick">{k + 1} / {items.length}</span>
    <div className="m1-slots" aria-label="answer">{pick.map((wi, n) => <button type="button" key={n} className="m1-token" onClick={() => st !== "good" && setPick(pick.filter((_, q) => q !== n))}>{it.words[wi]}</button>)}</div>
    <div className="m1-chips">{it.words.map((w, wi) => <button type="button" key={wi} className={`m1-token ${pick.includes(wi) ? "ghost" : ""}`} disabled={pick.includes(wi)} onClick={() => add(wi)}>{w}</button>)}</div>
    <p className={`m1-fb ${st === "good" ? "good" : st === "bad" ? "bad" : ""}`} aria-live="polite">{st === "good" ? "✓ " + it.answer : st === "bad" ? tx(it.hint, lang) : ""}</p>
    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
      <button type="button" className="m1-btn" onClick={() => { setPick([]); setSt("idle"); }} disabled={st === "good" || !pick.length}>{ui.again}</button>
      <button type="button" className="m1-btn p" disabled={st !== "good"} onClick={go}>{ui.nextQ} →</button>
    </div>
  </>);
}

function S14({ ui, rate, setRate }) {
  return (<>
    <h1 className="m1-title">{TITLES[13]}</h1>
    <p className="m1-sub">{ui.aloud}</p>
    <div className="m1-list">{C.s14.map((p) => (
      <div className="m1-phrase" key={p}><span className="m1-en" style={{ fontSize: "clamp(13px,1.7vw,17px)" }}>{p}</span>
        <span className="m1-chips">{["hard", "mid", "easy"].map((r) => <button type="button" key={r} className={`m1-chip ${rate[p] === r ? "on" : ""}`} onClick={() => setRate((x) => ({ ...x, [p]: r }))}>{ui.rate[r]}</button>)}</span></div>))}</div>
  </>);
}

/* ---------- Lesson ---------- */
export default function Lesson({ lang: supplied, onFinished, onProgress }) {
  const [pl, setPl] = useState("uz");
  const lang = ["uz", "ru", "en"].includes(supplied) ? supplied : pl;
  const ui = UI[lang];
  const [cur, setCur] = useState(0);
  const [ok, setOk] = useState({});
  const [rate, setRate] = useState({});
  const [fin, setFin] = useState(false);
  const res = useRef({}); const t0 = useRef(0); const doneRef = useRef(false);
  useEffect(() => { t0.current = Date.now(); }, []);
  useEffect(() => { onProgress?.({ current: cur + 1, total: ALL_TITLES.length }); }, [cur, onProgress]);
  const setGate = (i) => () => setOk((p) => (p[i] ? p : { ...p, [i]: true }));
  const rec = (tag, r) => { res.current[tag] = r; };
  const open = ok[cur] || cur === ALL_TITLES.length - 1;
  const finish = () => {
    if (doneRef.current) return; doneRef.current = true; setFin(true);
    const g = res.current; const sum = (k) => g[k]?.firstTry || 0; const rapid = g.rapid || { firstTry: 0, total: 4 };
    onFinished?.({
      lessonId: "M1L01-learn", lessonTitle: "Sentence Building and Questions",
      durationSec: Math.max(0, Math.round((Date.now() - t0.current) / 1000)),
      totalQuestions: rapid.total, correctAnswers: rapid.firstTry, scorePercent: Math.round((rapid.firstTry / rapid.total) * 100), passed: rapid.firstTry / rapid.total >= 0.6,
      firstTryStats: { total: 3 + 3 + 3 + 3 + 4, firstTryCorrect: sum("guided") + sum("build") + sum("fix") + sum("role") + rapid.firstTry },
      skillTags: meta.skillTags, answers: [], profile: { aloud: rate },
    });
  };
  const rapidView = (r) => {
    const passed = r.firstTry / r.total >= 0.6;
    const title = passed ? (lang === "ru" ? "Теория пройдена" : lang === "en" ? "Theory complete" : "Nazariy dars yakunlandi") : (lang === "ru" ? "Повторите теорию" : lang === "en" ? "Review the theory" : "Nazariyani takrorlang");
    const description = passed ? (lang === "ru" ? "Поздравляем! Теперь закрепите знания на практических заданиях." : lang === "en" ? "Well done! Now strengthen what you learned with practice." : "Tabriklaymiz! Endi o‘rganganlaringizni amaliy mashg‘ulotlarda mustahkamlang.") : ui.retake;
    return <div className="m1-result">
      <div className="m1-result-art">
        {passed && <div className="m1-confetti" aria-hidden="true">{Array.from({ length: 16 }, (_, index) => <i key={index} style={{ "--angle": `${index * 22.5}deg`, "--delay": `${index * -.22}s` }} />)}</div>}
        <div className="m1-result-ring" style={{ "--score": `${r.firstTry / r.total * 100}%` }} role="img" aria-label={`${r.firstTry} / ${r.total}`}><div className="m1-result-score"><small>{ui.resultTitle}</small><strong>{r.firstTry}/{r.total}</strong></div></div>
        <Coin text={passed ? "✓" : "↻"} sub="" />
      </div>
      <div className="m1-result-copy">
        <svg viewBox="0 0 72 64" fill="none" aria-hidden="true"><path d="M5 9c12-4 23-3 31 4 8-7 19-8 31-4v44c-12-4-23-3-31 4-8-7-19-8-31-4V9Z" fill="currentColor" opacity=".8"/><path d="M36 13v44M10 15v30m52-30v30" stroke="#30251a" strokeWidth="3"/><circle cx="57" cy="11" r="11" fill="#e8c98f"/><path d="m52 11 3 3 6-7" stroke="#20252a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <h2>{title}</h2><p>{description}</p><b>{passed ? ui.passed : ui.retake}</b>
      </div>
    </div>;
  };
  const common = { lang, ui, rec };
  const view = [
    ...THEORY.map((_, index) => <TheorySlide key={`theory-${index}-${lang}`} index={index} lang={lang} setGate={setGate(index)} />),
    <S1 key="mission" {...common} setGate={setGate(5)} />,
    <S2 key="read" {...common} setGate={setGate(6)} />,
    <S3 key="notice" {...common} setGate={setGate(7)} />,
    <S4 key="pattern-order" {...common} setGate={setGate(8)} />,
    <S5 key="pattern-verbs" {...common} setGate={setGate(9)} />,
    <S6 key="questions" {...common} setGate={setGate(10)} />,
    <S7 key="traps" {...common} setGate={setGate(11)} />,
    <S8 key="vocabulary" {...common} setGate={setGate(12)} />,
    <QuizSlide key="guided" {...common} idx={8} qs={C.s9} tag="guided" seed={0} setGate={setGate(13)} />,
    <S10 key="build" {...common} setGate={setGate(14)} />,
    <QuizSlide key="fix" {...common} idx={10} qs={C.s11} tag="fix" seed={1} setGate={setGate(15)} />,
    <QuizSlide key="role" {...common} idx={11} qs={C.s12} tag="role" seed={2} setGate={setGate(16)} />,
    <QuizSlide key="rapid" {...common} idx={12} qs={C.s13} tag="rapid" seed={3} retry={false} setGate={setGate(17)} finishView={rapidView} />,
    <S14 key="summary" ui={ui} rate={rate} setRate={setRate} />,
  ][cur];
  return (
    <main className="m1-root">
      <style>{STYLES}</style>
      <header className="m1-head">
        <span className="m1-eyebrow">M1L01 · {cur + 1}/{ALL_TITLES.length}</span>
        <span className="m1-dots" aria-hidden="true">{ALL_TITLES.map((_, k) => <i key={k} className={`m1-dot ${k <= cur ? "on" : ""}`} />)}</span>
        {!supplied && <span className="m1-chips">{["uz", "ru", "en"].map((l) => <button key={l} type="button" className={`m1-chip ${lang === l ? "on" : ""}`} onClick={() => setPl(l)}>{l.toUpperCase()}</button>)}</span>}
      </header>
      <section className="m1-body"><div className={`m1-slide ${cur === 17 && ok[17] ? "m1-result-slide" : ""}`} key={cur}>{view}</div></section>
      <footer className="m1-foot">
        <button type="button" className="m1-btn" disabled={cur === 0} onClick={() => setCur(cur - 1)}>← {ui.back}</button>
        {!open && <span className="m1-hold">{ui.hold}</span>}
        {fin ? <span className="m1-fb good">{ui.done} ✓</span> : cur < ALL_TITLES.length - 1
          ? <button type="button" className="m1-btn p" disabled={!open} onClick={() => setCur(cur + 1)}>{ui.next} →</button>
          : <button type="button" className="m1-btn p" onClick={finish}>{ui.finish}</button>}
      </footer>
    </main>
  );
}
