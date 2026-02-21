"use client";

import CountUp from "react-countup";

const CountUpSection = ({stats}) => {
    return (
        <div className="container px-4 py-8 mx-auto md:py-10">
            <div className="grid grid-cols-2 gap-6 py-6 border-t border-b border-gray-400 md:grid-cols-3 md:gap-8">
                {stats.map((stat, index) => (
                    <CountUp 
                        key={index}
                        start={0} 
                        end={stat.number} 
                        duration={2}
                        delay={index * 0.1}
                        separator={","}
                        enableScrollSpy
                        scrollSpyOnce
                    >
                        {({ countUpRef }) => (
                            <div className="text-center">
                                <div className="flex items-center justify-center">
                                    <div className="flex items-baseline gap-1 mb-2">
                                        <span 
                                            ref={countUpRef} 
                                            className="text-2xl font-semibold text-right sm:text-3xl md:text-4xl lg:text-5xl text-primary-color-dark"
                                        />
                                        <span className="text-xl font-bold sm:text-2xl md:text-3xl lg:text-4xl text-primary-color-dark">
                                            {stat.symbol}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm font-semibold sm:text-base md:text-lg lg:text-lg whitespace-nowrap">
                                    {stat.label}
                                </p>
                            </div>
                        )}
                    </CountUp>
                ))}
            </div>
        </div>
    )
}

export default CountUpSection;