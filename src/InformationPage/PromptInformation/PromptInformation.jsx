import InformationTopNav from "../../components/InformationTopNav/InformationTopNav";
import React, { Component, useContext } from "react";
import { Carousel } from 'antd';
import "./PromptInformation.css";
import { Orgcontext } from "../../context/ApiContext";

class PromptInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            slideIndex: 0
        };
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.navigateToDesign = this.navigateToDesign.bind(this);
    }

    next() {
        if (this.state.slideIndex < 9) {
            this.slider.next();
            this.setState({ slideIndex: this.state.slideIndex + 1 });
        }
    }

    previous() {
        if (this.state.slideIndex > 0) {
            this.slider.prev();
            this.setState({ slideIndex: this.state.slideIndex - 1 });
        }
    }

    navigateToDesign() {
        window.open('../product', '_self');
    }

    render() {
        const orgDetails = Object.values(this.props).map(item => {return item});
        const promptTips = [
            {
                title: "Be Specific and Detailed",
                tipDesp: "Clearly describe what you want. Include details about the subject, setting, colors, style, and mood. The more specific you are, the closer the result will be to your vision."
            },
            {
                title: "Set the Context",
                tipDesp: "Explain the background or setting of your design. Is it a futuristic cityscape, a serene landscape, or a bustling market? Context helps the AI understand the environment of your design."
            },
            {
                title: "Mention Desired Colors and Lighting",
                tipDesp: "If you have preferences for color schemes or lighting (e.g., sunset, neon lights), mention them. Colors and lighting can dramatically change the mood of a design."
            },
        ];

        return (
            <div id="promptPage" className="flex flex-col align-center justify-center w-4/5 max-w-screen-lg mt-[4rem]">
                <InformationTopNav title="How to Write Effective Descriptions" />
                <Carousel
                    ref={(c) => (this.slider = c)}
                    className="h-[30rem] bg-[#F5F5F7] drop-shadow-lg mx-auto w-full rounded-md my-[2rem] p-[2rem] relative max-w-2xl"
                    dots={false}
                    effect="fade"
                >
                    {promptTips.map((data, index) => (
                        <div key={index}>
                            <div className="text-pretty text-3xl font-medium mb-[2rem]" style={{ fontFamily: `${orgDetails[0].font}` }}>{data.title}</div>
                            <div className="text-justify text-2xl h-[15rem] grid place-items-center">
                                <span className="text-pretty" style={{ fontFamily: `${orgDetails[0].font}` }}>{data.tipDesp}</span>
                            </div>
                            <div className="text-2xl" style={{ fontFamily: `${orgDetails[0].font}` }}>{index + 1}/{promptTips.length}</div>
                        </div>
                    ))}
                </Carousel>

                <div className="grid grid-cols-2 mx-auto justify-items-center gap-8">
                    <button
                        className="w-[8rem] md:w-[20rem] h-[3rem] text-white rounded-lg"
                        onClick={this.previous}
                        style={{ fontFamily: `${orgDetails[0].font}`, backgroundColor: `${orgDetails[0].themeColor}` }}
                    >
                        Prev
                    </button>
                    {this.state.slideIndex === 2 ? (
                        <button
                            className="bg-[#0491F7] w-[8rem] md:w-[20rem] h-[3rem] text-white rounded-lg"
                            onClick={this.navigateToDesign}
                            style={{ fontFamily: `${orgDetails[0].font}`, backgroundColor: `${orgDetails[0].themeColor}` }}
                        >
                            Go to Design
                        </button>
                    ) : (
                        <button
                            className="bg-[#0491F7] w-[8rem] md:w-[20rem] h-[3rem] text-white rounded-lg"
                            onClick={this.next}
                            style={{ fontFamily: `${orgDetails[0].font}`, backgroundColor: `${orgDetails[0].themeColor}` }}
                        >
                            Next
                        </button>
                    )}
                </div>

                <div className="text-left text-xl my-[2rem]" style={{ fontFamily: `${orgDetails[0].font}` }}>Example</div>
                <div className="text-lg text-justify mb-[4rem]" style={{ fontFamily: `${orgDetails[0].font}` }}>
                    "Create an image of a mystical forest at dusk. The scene should feature ancient trees with glowing moss, a small pond reflecting the twilight sky, and fireflies around the water. The mood is serene and enchanting. Colors should be mainly greens, blues, and purples, with a realistic yet slightly dreamy style."
                </div>
            </div>
        );
    }
}

const PromptInformationContainer = () => {
    const orgDetails = useContext(Orgcontext);

    return <PromptInformation orgDetails={orgDetails} />;
}

export default PromptInformationContainer;
