import { Card } from 'antd';
import koushik from "../assets/team_koushik.png"
import trilok from "../assets/team_trilokshan.jpg"
import kush from "../assets/team_kush.png"

function DriverPage(){
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-items-center mt-[3rem]'>
        <Card title="Team" className="m-5 mt-8 py-4 shadow-[0_0_6px_rgba(0,0,0,0.5)] w-5/6">
        <div className="py-2 text-md">
                <p> Drophouse. est 2023 </p>
                <br />
                <p> At Drophouse, we believe fashion should be accessible to everyone. Every Drop is unique and one of a kind. Chances that you spot someone else wearing your hoodie are zero, nada, zilch.... </p>
                <br />
                <p> How? We like to call it fashion engineering. When you take three engineers from the top school in the nation and put their minds towards sustainabilty, creativty, and identity but in a fashionalble way. Thats how Drophouse was born.   </p>
                <br />
                <p> We are committed to eco-friendly materials and ethical manufacturing. We carry ZERO inventory because we care about the planet. </p>
            </div>
        </Card>

        <Card className="m-5 mt-8 py-4 shadow-[0_0_6px_rgba(0,0,0,0.5)] w-5/6 ">

            <div className='w-[100%] flex justify-center'>
                <img className="w-8/12 mx-auto my-8 object-cover"  src={koushik} ></img>
            </div>
       
            <div className="py-2 px-4 items-start">
                <h1 className="text-4xl font-bold font-['Karma']">Koushik</h1>
            </div>
            <div className="py-2">
                <h1  className="text-2xl font-bold font-['Karma'] text-[#595959]"> Investor </h1>
                <br />
                <p> I wanted to combine my love and experience in fashion, engineering, and cybersecurity to make something stylish, functional, and provide an identity.  </p>
            </div>
        </Card>

        <Card className="m-5 mt-8 py-4 shadow-[0_0_6px_rgba(0,0,0,0.5)] w-5/6">
            <div className='w-[100%] flex justify-center'>
                <img className="w-8/12 mx-auto my-8" src={trilok} ></img>
            </div>
            <div className="py-2 px-4 items-start">
                <h1 className="text-4xl font-bold font-['Karma']">Trilokshan</h1>
            </div>
            <div className="py-2">
                <h1  className="text-2xl font-bold font-['Karma'] text-[#595959]"> co-founder </h1>
                <br />
                <p> My goal through this company was to revive the fading culture of face-to-face conversations and engagement. Our unique shirts serve as icebreakers, sparking real conversations and authentic connections beyond the screen. </p>
            </div>
        </Card>

        <Card className="m-5 mt-8 py-4 shadow-[0_0_6px_rgba(0,0,0,0.5)] w-5/6">
            <div className='w-[100%] flex justify-center'>
                <img className="w-8/12 mx-auto my-8" src={kush} ></img>
            </div>
            <div className="py-2 px-4 items-start">
                <h1 className="text-4xl font-bold font-['Karma']">Kush</h1>
            </div>
            <div className="py-2">
                <h1  className="text-2xl font-bold font-['Karma'] text-[#595959]"> co-founder </h1>
                <br />
                <p> I see value in using technologies such as Gen AI to let people create things they care about. </p>
            </div>
        </Card>
    </div>
    )
}

export default DriverPage