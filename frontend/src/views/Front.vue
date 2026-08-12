<template>
    <div class="front">
        <section class="hero">
            <div class="hero-content">
                <span class="hero-label">BOOKSTORE</span>
                <h1>Find your next story.</h1>
                <p>
                    Discover books, save your favorites
                    and order your next read in a few clicks.
                </p>

                <button class="hero-button" @click="router.push('/books')">
                    Browse books
                    <span>→</span>
                </button>
            </div>

            <div class="hero-books">
                <div class="book-shape book-one">
                    <div class="book-page"></div>
                </div>

                <div class="book-shape book-two">
                    <div class="book-page"></div>
                </div>

                <div class="book-shape book-three">
                    <div class="book-page"></div>
                </div>
            </div>
        </section>

        <section class="features">
            <div class="section-heading">
                <span>WHY BOOKSTORE</span>
                <h2>Everything you need to find your next book.</h2>
            </div>

            <div class="feature-grid">
                <article class="feature">
                    <div class="feature-number">01</div>
                    <h3>Find books</h3>
                    <p>
                        Search through the catalog and quickly find
                        the book you're looking for.
                    </p>
                </article>

                <article class="feature">
                    <div class="feature-number">02</div>
                    <h3>Save favorites</h3>
                    <p>
                        Keep interesting books in your favorites
                        and come back to them whenever you want.
                    </p>
                </article>

                <article class="feature">
                    <div class="feature-number">03</div>
                    <h3>Order easily</h3>
                    <p>
                        Add books to your cart and place an order
                        without unnecessary steps.
                    </p>
                </article>
            </div>
        </section>

        <section class="process">
            <div class="process-content">
                <span class="section-label">HOW IT WORKS</span>
                <h2>From discovery to your bookshelf.</h2>
                <p>
                    A simple shopping experience designed to help
                    you spend less time searching and more time reading.
                </p>
            </div>

            <div class="steps">
                <div class="step">
                    <span>01</span>
                    <div>
                        <h3>Search</h3>
                        <p>Find a book by title or author.</p>
                    </div>
                </div>

                <div class="step">
                    <span>02</span>
                    <div>
                        <h3>Choose</h3>
                        <p>Add it to your cart or favorites.</p>
                    </div>
                </div>

                <div class="step">
                    <span>03</span>
                    <div>
                        <h3>Order</h3>
                        <p>Place your order in a few clicks.</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="cta">
            <div>
                <span class="section-label">START READING</span>
                <h2>There is always another story to discover.</h2>
            </div>

            <button class="cta-button" @click="router.push('/books')">
                Explore books
                <span>→</span>
            </button>
        </section>
    </div>
</template>

<script setup>
import {useRouter} from 'vue-router'

const router=useRouter()
</script>

<style scoped>
.front{
    width:100%;
    max-width:1150px;
    margin:0 auto;
    padding:0 20px 60px;
    box-sizing:border-box;
    font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    color:#202522;
}
.hero{
    position:relative;
    display:flex;
    align-items:center;
    min-height:470px;
    margin:25px 0 70px;
    padding:60px;
    box-sizing:border-box;
    overflow:hidden;
    border-radius:22px;
    background:linear-gradient(120deg,#1f7130,#318a3e 55%,#55a762);
    color:white;
    box-shadow:0 18px 40px rgba(39,123,52,.18);
}
.hero::before{
    content:"";
    position:absolute;
    width:420px;
    height:420px;
    right:-150px;
    top:-180px;
    border-radius:50%;
    border:1px solid rgba(255,255,255,.16);
    box-shadow:0 0 0 60px rgba(255,255,255,.035),0 0 0 120px rgba(255,255,255,.025);
}
.hero::after{
    content:"";
    position:absolute;
    width:280px;
    height:280px;
    left:-160px;
    bottom:-190px;
    border-radius:50%;
    background:rgba(255,255,255,.08);
}
.hero-content{
    position:relative;
    z-index:2;
    max-width:570px;
    animation:hero-content .7s ease both;
}
.hero-label{
    display:inline-block;
    margin-bottom:16px;
    font-size:12px;
    font-weight:700;
    letter-spacing:3px;
    opacity:.75;
}
.hero h1{
    margin:0 0 20px;
    font-size:58px;
    line-height:1;
    letter-spacing:-2.5px;
    font-weight:800;
}
.hero p{
    max-width:480px;
    margin:0 0 30px;
    color:rgba(255,255,255,.84);
    font-size:17px;
    line-height:1.7;
}
.hero-button{
    display:flex;
    align-items:center;
    gap:20px;
    padding:13px 18px 13px 20px;
    border:0;
    border-radius:9px;
    background:#fff;
    color:#277b34;
    font-family:inherit;
    font-size:14px;
    font-weight:700;
    cursor:pointer;
    transition:transform .25s,box-shadow .25s;
}
.hero-button span{
    font-size:20px;
    line-height:12px;
    transition:transform .25s;
}
.hero-button:hover{
    transform:translateY(-3px);
    box-shadow:0 10px 22px rgba(0,0,0,.16);
}
.hero-button:hover span{
    transform:translateX(4px);
}
.hero-books{
    position:absolute;
    right:80px;
    bottom:0;
    width:330px;
    height:380px;
    animation:books-enter .8s .15s ease both;
}
.book-shape{
    position:absolute;
    bottom:25px;
    width:145px;
    height:245px;
    box-sizing:border-box;
    border-radius:5px 10px 10px 5px;
    box-shadow:12px 15px 30px rgba(0,0,0,.2);
}
.book-shape::before{
    content:"";
    position:absolute;
    top:22px;
    left:16px;
    right:16px;
    height:2px;
    background:rgba(255,255,255,.35);
}
.book-shape::after{
    content:"BOOK";
    position:absolute;
    top:82px;
    left:16px;
    color:rgba(255,255,255,.8);
    font-size:13px;
    font-weight:700;
    letter-spacing:3px;
}
.book-page{
    position:absolute;
    top:0;
    right:-7px;
    width:8px;
    height:100%;
    border-radius:0 5px 5px 0;
    background:#eeeae0;
}
.book-one{
    left:25px;
    z-index:1;
    bottom:35px;
    background:#b85c4d;
    transform:rotate(-10deg);
}
.book-two{
    left:95px;
    z-index:3;
    background:#e2a83f;
    transform:rotate(4deg);
}
.book-three{
    left:165px;
    z-index:2;
    bottom:40px;
    background:#315b70;
    transform:rotate(13deg);
}
.features{
    margin-bottom:90px;
}
.section-heading{
    max-width:650px;
    margin-bottom:35px;
}
.section-heading>span,
.section-label{
    color:#318a3e;
    font-size:11px;
    font-weight:700;
    letter-spacing:2px;
}
.section-heading h2{
    margin:10px 0 0;
    font-size:32px;
    line-height:1.2;
    letter-spacing:-1px;
}
.feature-grid{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:16px;
}
.feature{
    min-height:210px;
    padding:25px;
    box-sizing:border-box;
    border:1px solid #e1e4e1;
    border-radius:14px;
    background:#fff;
    transition:transform .25s,box-shadow .25s,border-color .25s;
}
.feature:hover{
    transform:translateY(-6px);
    border-color:#cbd8cd;
    box-shadow:0 12px 25px rgba(31,61,37,.08);
}
.feature-number{
    margin-bottom:40px;
    color:#318a3e;
    font-size:12px;
    font-weight:700;
    letter-spacing:1px;
}
.feature h3{
    margin:0 0 9px;
    font-size:19px;
}
.feature p{
    margin:0;
    color:#727a74;
    font-size:14px;
    line-height:1.6;
}
.process{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:80px;
    margin-bottom:90px;
    padding:55px;
    box-sizing:border-box;
    border-radius:18px;
    background:#f1f5f1;
}
.process-content h2{
    max-width:400px;
    margin:10px 0 15px;
    font-size:32px;
    line-height:1.2;
    letter-spacing:-1px;
}
.process-content>p{
    max-width:430px;
    margin:0;
    color:#707870;
    font-size:14px;
    line-height:1.7;
}
.steps{
    display:flex;
    flex-direction:column;
    gap:10px;
}
.step{
    display:flex;
    align-items:center;
    gap:20px;
    padding:18px 20px;
    border:1px solid #dfe6df;
    border-radius:10px;
    background:#fff;
    transition:transform .2s,box-shadow .2s;
}
.step:hover{
    transform:translateX(5px);
    box-shadow:0 6px 15px rgba(31,61,37,.07);
}
.step>span{
    color:#318a3e;
    font-size:12px;
    font-weight:700;
}
.step h3{
    margin:0 0 4px;
    font-size:15px;
}
.step p{
    margin:0;
    color:#7a817c;
    font-size:13px;
}
.cta{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap:30px;
    padding:40px 45px;
    border-radius:16px;
    background:#202522;
    color:#fff;
}
.cta h2{
    max-width:600px;
    margin:8px 0 0;
    font-size:28px;
    line-height:1.25;
    letter-spacing:-.7px;
}
.cta .section-label{
    color:#67b573;
}
.cta-button{
    display:flex;
    align-items:center;
    gap:18px;
    flex-shrink:0;
    padding:13px 18px;
    border:0;
    border-radius:9px;
    background:#318a3e;
    color:#fff;
    font-family:inherit;
    font-size:14px;
    font-weight:700;
    cursor:pointer;
    transition:background .2s,transform .2s,box-shadow .2s;
}
.cta-button span{
    font-size:19px;
    transition:transform .2s;
}
.cta-button:hover{
    background:#3c9949;
    transform:translateY(-2px);
    box-shadow:0 8px 20px rgba(49,138,62,.25);
}
.cta-button:hover span{
    transform:translateX(4px);
}
@keyframes hero-content{
    from{
        opacity:0;
        transform:translateY(20px);
    }
    to{
        opacity:1;
        transform:translateY(0);
    }
}
@keyframes books-enter{
    from{
        opacity:0;
        transform:translateY(35px) scale(.95);
    }
    to{
        opacity:1;
        transform:translateY(0) scale(1);
    }
}
@media(max-width:900px){
    .hero{
        padding:45px;
    }
    .hero h1{
        font-size:48px;
    }
    .hero-books{
        right:20px;
        opacity:.35;
    }
    .process{
        gap:40px;
        padding:40px;
    }
}
@media(max-width:700px){
    .front{
        padding:0 12px 40px;
    }
    .hero{
        min-height:430px;
        margin:15px 0 55px;
        padding:35px 28px;
    }
    .hero h1{
        font-size:40px;
        letter-spacing:-1.5px;
    }
    .hero p{
        font-size:15px;
    }
    .hero-books{
        right:-30px;
        bottom:-40px;
        transform:scale(.8);
        opacity:.3;
    }
    .feature-grid{
        grid-template-columns:1fr;
    }
    .feature{
        min-height:auto;
    }
    .feature-number{
        margin-bottom:25px;
    }
    .process{
        grid-template-columns:1fr;
        gap:35px;
        padding:30px;
        margin-bottom:55px;
    }
    .process-content h2{
        font-size:27px;
    }
    .cta{
        flex-direction:column;
        align-items:flex-start;
        padding:30px;
    }
    .cta h2{
        font-size:24px;
    }
}
@media(max-width:450px){
    .hero{
        min-height:400px;
        padding:30px 23px;
    }
    .hero h1{
        font-size:35px;
    }
    .hero-books{
        transform:scale(.65);
        right:-65px;
        bottom:-70px;
    }
    .section-heading h2{
        font-size:27px;
    }
}
</style>