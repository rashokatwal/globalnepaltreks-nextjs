const Heading = ({ title, subtitle, titleClass = "", subtitleClass = "" }) => {
    const titleBaseClasses = "mt-5 font-semibold uppercase text-primary-color-dark text-md md:text-2xl";
    
    const subtitleBaseClasses = "mt-2 mb-8 text-3xl font-bold md:text-4xl";
    
    const combinedTitleClasses = `${titleBaseClasses} ${titleClass}`.trim();
    const combinedSubtitleClasses = `${subtitleBaseClasses} ${subtitleClass}`.trim();
    
    return (
        <div>
            {title && (
                <h1 className={combinedTitleClasses}>
                    {title}
                </h1>
            )}
            {subtitle && (
                <p className={combinedSubtitleClasses}>
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default Heading;