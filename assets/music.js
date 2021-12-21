



/** Việc cần làm
 * 
1. Render songs
2. Scroll top
3. PLay / pause / seek
4. CD rotate
5. Next / Previous
6. Ramdom
7. Next / Repeat when ended
8. Active song 
9. Scroll acctive song into view
10.Play song when click into playlist 
*/




const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
        const heading = $('header h2')
        const cdThumb = $('.cd-thumb')
        const audio = $('#audio') 
        const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const optionBtn = $('.option')
const songBtn = $('.song')
const repeatBtn = $('.btn-repeat')
const playListBtn = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom:false,
    isRepeat:false,
    songs : [
        {
            name: 'Build A Bitch',
            singer: 'Bella Poarch',
            path: './assets/music/buildabitch.song1',
            image: './assets/img/bellabitch.jpg'
        },
        {
            name: 'We don\'t talk anymore',
            singer: 'Charlie Puth',
            path: './assets/music/We Don_t Talk Anymore - Charlie Puth_ Se.mp3',
            image: './assets/img/charlieputh.10.jpg'
        },
        {
            name: 'Bước qua nhau',
            singer: 'Vũ',
            path: './assets/music/buocquanhau.song',
            image: './assets/img/vu2.jfif'
        },
        {
            name: 'Cưới thôi',
            singer: 'Masew',
            path: './assets/music/CuoiThoi-MasewMasiuBRayTAPVietNam-7085648.mp3',
            image: './assets/img/masaw3.jfif'
        },
        {
            name: 'Dusk Till Dawn',
            singer: 'Zayn malik',
            path: './assets/music/DuskTillDawn-ZaynSia-5164057.mp3',
            image: './assets/img/zayn malik 4.png'
        },
        {
            name: 'Faded',
            singer: 'Alan Walker',
            path: './assets/music/Faded-AlanWalker-5919763.mp3',
            image: './assets/img/faded5.jpg'
        },
        {
            name: 'Lemon Tree',
            singer: 'Dong Ba',
            path: './assets/music/Lemon Tree - Fools Garden.mp3',
            image: './assets/img/lemon-tree-6.jpg'
        },
        {
            name: 'Thunder',
            singer: 'GabryPontel',
            path: './assets/music/Thunder-GabryPonteLUMXPrezioso-7087951.mp3',
            image: './assets/img/thunder.jpg'
        },
        {
            name: 'Toxic',
            singer: 'Boy with Uke',
            path: './assets/music/Toxic-BoyWithUke-7114178.mp3',
            image: './assets/img/toxic8.jpg'
        },
        {
            name: 'Unstoppable',
            singer: 'Sia',
            path: './assets/music/Unstoppable-Sia-4312901.mp3',
            image: './assets/img/unstoppable-min_9.jpg'
        }
    ],




    render: function(){
        const htmls = this.songs.map((song,index) => {
            //Active song (thêm active vào song )
            const songActive = index === this.currentIndex ? 'active' : '' 
            return `
                <div class="playlist">
                    <div class="song ${songActive}" data-index="${index}"> 
                        <div class="thumb" 
                        style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p>${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fa fa-ellipsis-v"></i>
                        </div>
                    </div>
                </div>
            `
        })
        $('.playlist').innerHTML = htmls.join('')
    },




    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })

    },




    handleEvent: function(){
        const _this = this 

        //4 Xử lý quay / dừng CD
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 50000,  // 50 seconds
            interations: Infinity
        })
        cdThumbAnimate.pause()

        


        //Xử lý phóng to/ thu nhỏ thumbnail khi kéo playlist
        const cdWidth = cd.offsetWidth
        document.onscroll = function(){
            const scrollTop = document.documentElement.scrollTop || window.scrollY

            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth : 0
            cd.style.opacity = newCdWidth / cdWidth 
        }


        //Làm việc khi click PLay
        playBtn.onclick = function(){
            if(_this.isPlaying) {
                audio.pause()
            }else{
                audio.play()
            }
        }

        //Khi song được played
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        //Khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        
        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }




        //Khi tua song
        progress.onchange = function(e){
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime 
        }
        


        //5Khi next song
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render() //activeSong
            //9. Scroll acctive song into view
            _this.scrollToActiveSong()
        }

        //5Khi prev song 
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.randomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render() //activeSong
            //9. Scroll acctive song into view
            _this.scrollToActiveSong()
        }

        //6 Random
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
        }

        //Xử lý next song when ended
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play()
            }else{
                nextBtn.onclick()
            }
        }

        //Xử lý khi repeat song  
        repeatBtn.onclick = function(){
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }  

        

        //10. Lắng nghe click vào playList
        playListBtn.onclick = function(e){
            const songElement = e.target.closest('.song:not(.active)')
            const songOption = e.target.closest('.option')
            if(songElement || songOption ) {
                //Xử lý khi click vào từng song 
                 if(songElement){
                    _this.currentIndex = Number(songElement.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                 }
                //Xử lý khi click vào option 



            }
        }
    },



    //9. Xử lý scroll acctive song into view
    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:'center',
                inline: 'nearest'
            })
        },200)
    },




    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },



        
    //Lấy ra bài hát khi next / pre
    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function(){
        let newIndex = this.currentIndex
        do{
            newIndex = Math.floor(Math.random(this.songs.length) * this.songs.length)
        }while(newIndex === this.currentIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    
    




    start: function(){
        //Định nghĩa các thuộc tính trong object
        this.defineProperties()

        //Lắng nghe / xử lý các sự kiện trong (DOM event)
        this.handleEvent()

        //Tải bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        //Render  playlist
        this.render();
    }
}
app.start()