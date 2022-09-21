

//Oluşturulan kişi için bir sınıf oluşturdum
class Kisi{ 
    //ilkleme, Ne zaman kisi nesnesi oluşturacağım o zaman bana ad soyad mail değerleri olmalı
    constructor(ad,soyad,mail){
        this.ad=ad;
        this.soyad=soyad;
        this.mail=mail;
        //this diyerek bu nesnenin 'adi'na ad olarak gelen parametreyi ata.
        //örn;furkan adında nesne oluşturduğumuzda furkan. dediğimizde bu adi,soyadi,maili alanlarına ulaşırız
    }
}

class kontrol{
    static bosAlanKontrolEt(...alanlar){//kaç tane alan(parametre) gönderileceği belli olmadığı durumlarda ... spread operatörü
        let sonuc = true;
        alanlar.forEach(alan=>{
            if(alan.length === 0){
                sonuc = false;
                return false;
            }
        });
        return sonuc;
    }


}

//Tüm arayüz için bir sınıf oluşturdum.UI
//eleman seçimi, addeventlistener eklenmesi gibi.
class Ekran{
    constructor(){
        this.ad=document.getElementById('ad');
        this.soyad=document.getElementById('soyad');
        this.mail=document.getElementById('mail');
        this.ekleGuncelleButton=document.querySelector('.ekleGuncelle');
        this.form=document.getElementById('form-rehber');
        this.form.addEventListener('submit',this.ekleGuncelle.bind(this));//fonk global değil ekran sınıfı içinde tanımlı old. için this ile kullanmamız gerekir
        //.bind(this) diyerek eğer ekleguncelle fonk kulanacaksan thsi diyerek form elementini çağırıdı bind diyerek şuanki objeyi yani ekran onjesini temsil eder.
        this.VeriTabaniLocal=new VeriTabaniLocal();
        this.kisiListesi=document.querySelector('.kisi-listesi');
        this.kisiListesi.addEventListener('click',this.guncelleVeyaSil.bind(this));
        this.VeriTabaniLocal=new VeriTabaniLocal(); //new lemeden bu class içinde VeriTabaniLocal. diyerek fonk erişim sağlamama yarıyor 

        //update veya delete butonuna basıldığında ilgili tr elemantini tutar
        this.secilenSatir=undefined;
        this.kisileriEkranaYazdir();
    }

    alanlariTemizle(){
        this.ad.value="";
        this.soyad.value="";
        this.mail.value="";
    }
    guncelleVeyaSil(e){
        const tiklanmaYeri=e.target;

        if(tiklanmaYeri.classList.contains('btn--delete')){
           this.secilenSatir=tiklanmaYeri.parentElement.parentElement;
           this.kisiyiEkrandanSil();
        }
        else if(tiklanmaYeri.classList.contains('btn--edit')){
            this.secilenSatir=tiklanmaYeri.parentElement.parentElement;
            this.ekleGuncelleButton.value='Güncelle';
            this.ad.value=this.secilenSatir.cells[0].textContent;
            this.soyad.value=this.secilenSatir.cells[1].textContent;
            this.mail.value=this.secilenSatir.cells[2].textContent;
        }
    }
    kisiyiEkrandanGuncelle(kisi){//MAVİ GÜNCELLE BUTONU

        //tüm yeni değerler(kisi) ve eski mail değeri(güncellenmeden önceki).
        const sonuc = this.VeriTabaniLocal.kisiGuncelle(kisi,this.secilenSatir.cells[2].textContent);
        if(sonuc){
        //secilen satırdaki değerleri, ekrandaki yeni değiştirilen değerler ile güncellenecek
        this.secilenSatir.cells[0].textContent=kisi.ad;
        this.secilenSatir.cells[1].textContent=kisi.soyad;
        this.secilenSatir.cells[2].textContent=kisi.mail;
        this.secilenSatir=undefined;
        this.ekleGuncelleButton.value="Kaydet";
        this.alanlariTemizle();
        this.bilgiOlustur('Kişi Güncellendi',true);
        }
        else{
            this.bilgiOlustur("Güncellemek İstediğiniz Mail Kullanımda",false);
        }
        

      
        
    }
    kisiyiEkrandanSil(){
        this.secilenSatir.remove();
        const silinecekMail=this.secilenSatir.cells[2].textContent; 
        this.VeriTabaniLocal.kisiSil(silinecekMail);
        this.alanlariTemizle();
        this.secilenSatir=undefined;
        this.bilgiOlustur('Kişi rehberden silindi',false);
    }

    kisileriEkranaYazdir(){
        this.VeriTabaniLocal.tumKisiler.forEach(kisi=>{
            this.kisiyiEkranaEkle(kisi);
        });
    }

    kisiyiEkranaEkle(kisi){
        const olusturulanTR=document.createElement('tr');
        olusturulanTR.innerHTML=`<td>${kisi.ad}</td>
        <td>${kisi.soyad}</td>
        <td>${kisi.mail}</td>
        <td><button class="btn btn--edit"><i class="fa-regular fa-pen-to-square"></i></button>
        <button class="btn btn--delete"><i class="fa-regular fa-trash-can"></i></button></td>`;

        this.kisiListesi.appendChild(olusturulanTR);
        this.alanlariTemizle();

    }

    ekleGuncelle(e){//MAVİ KAYDET BUTONU
        e.preventDefault();

        const kisi = new Kisi(this.ad.value,this.soyad.value,this.mail.value);
        const sonuc = kontrol.bosAlanKontrolEt(kisi.ad,kisi.soyad,kisi.mail);


        //tüm alanlar dolu ise
        if(sonuc){

            //secilen satır null-undefined değil ise güncellenecek
            if(this.secilenSatir){
                this.kisiyiEkrandanGuncelle(kisi);
                
            }
            else//secilen satır undefined ise ilk defa çalıştırıldıysa ekleme yapılacaktır
            {
                //kisiyi  localStrorageye ekler
                const sonuc=this.VeriTabaniLocal.kisiEkle(kisi);
                console.log("sonuc : "+sonuc+" kaydetguncelle içinde");
                    if(sonuc){
                        //yeni kişiyi ekrana ekler
                        this.kisiyiEkranaEkle(kisi);
                        this.bilgiOlustur('Kişi Başarıyla Eklendi',true);
                        this.alanlariTemizle();
                    } 
                    else{
                        this.bilgiOlustur("Bu Mail Kullanımda",false);
                    }
            }

            
            
        }
        else{//eğer boş alan varsa
            this.bilgiOlustur('Boş alanları doldurunuz',false);
        }
    }

    bilgiOlustur(mesaj,durum){
        const olusturulanBilgi=document.createElement('div');
        olusturulanBilgi.textContent=mesaj;
        olusturulanBilgi.className='bilgi';

        olusturulanBilgi.classList.add(durum?'bilgi--success':'bilgi--error');
        document.querySelector('.container').insertBefore(olusturulanBilgi,this.form);

        setTimeout(function(){
            const silinecekDiv=document.querySelector('.bilgi');
            if(silinecekDiv){
                silinecekDiv.remove();
            }
        },1500);
    }

}


class VeriTabaniLocal{
    //uygulama açıldığında verileri geitirir
    constructor(){
        this.tumKisiler=this.kisileriGetir();
        //this.tumKisiler=[]; 111
    }

    emailUniqMi(mail){

        const sonuc=this.tumKisiler.find(kisi=>{
            return kisi.mail===mail;
        });
        //true ise mail var ise kayıt olamaz false değer döndürmemiz gerekli
        if(sonuc){
            console.log(mail+" Kullanımda");
            return false;
        }
        else{
            console.log(mail+ " Kullanımda değil ekleme/güncelleme yapılabilir");
            return true;
        }
    }
    kisileriGetir(){
   
        let tumKisilerLocal;
        if(localStorage.getItem('tumKisiler')===null){
            tumKisilerLocal=[];
        }
        else{//eğer tumKisiler varsa,localStorageniin içindekileri TumKisilerLocal'e aktar
            tumKisilerLocal=JSON.parse(localStorage.getItem('tumKisiler'));
        }
        //this.tumKisiler=tumKisilerLocal; 111
        return tumKisilerLocal;
    }

    kisiEkle(kisi){

        if(this.emailUniqMi(kisi.mail)){//diziye yeni eklenen kisi'yi ekledim.
        this.tumKisiler.push(kisi);
        localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler));//dizide tuttuğum elemanı tekrar localstorage'ye yazdım.
        return true;
        }
        else{
            return false;

        }

        
    }

    //Mail'i ID  gibi kabul etik
    kisiSil(mail){
        this.tumKisiler.forEach((kisi,index)=>{
            if(kisi.mail===mail){
                this.tumKisiler.splice(index,1);//var olan dizini içinde yeni dizi oluşturup onu güncelleyecek
            }
        });
        //silimiş halii locale yazdık
        localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler));
    }

    //güncellenmiş kişi yeni değerler içerir, mail kişinin veritabanında bulunması için gerekli eski mailini içerir.
    kisiGuncelle(guncellenmisKisi,mail){
        
        //Güncelleme işlemi sırasında; güncellenen mail eski maile eşit ise işlem yap(ör mail aynı ama adını düzeltmek istemiştir)
        if(guncellenmisKisi.mail===mail){
            this.tumKisiler.forEach((kisi,index)=>{
                if(kisi.mail===mail)
                {
                    this.tumKisiler[index]=guncellenmisKisi;
                    localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler));//güncellenmiş hali locale yazdık
                    return true;
                }
            });
            return true;
        }

        //Burası yukarıdaki if(guncellenmisKisi.mail===mail) false dönerse çalışacaktır
        //yani güncellenmek istenen mail varolan mailine eşit değil ise veritabanındaki diğer maillere bakacak o isimde mail adresi kontrolu yapacak
        if(this.emailUniqMi(guncellenmisKisi.mail))
        {
            console.log(guncellenmisKisi.mail+" için kontrol yapılıyor ve sonuç : güncelleme yapılabilir");  
            this.tumKisiler.forEach((kisi,index)=>{
            if(kisi.mail===mail)
            {
                this.tumKisiler[index]=guncellenmisKisi;
                localStorage.setItem('tumKisiler',JSON.stringify(this.tumKisiler));//güncellenmiş hali locale yazdık
                return true;
            }
        });

        return true;
        }
    
        else
        {
            console.log(guncellenmisKisi.mail+" mail kullanımda güncelleme yapılamaz");
            return false;
        }

    }

}


//Tüm Html yapısı yüklendiğinde çalışır
document.addEventListener('DOMContentLoaded',function(e){
    const ekran = new Ekran(); //ekran sınıfındaki constructor çalışır
});