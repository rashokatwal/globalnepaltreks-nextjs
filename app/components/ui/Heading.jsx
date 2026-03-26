const Heading = ({ title, subtitle, titleClass = "", subtitleClass = "" }) => {
    
    const subtitleBaseClasses = "mt-2 mb-8 text-3xl text-primary-color-dark font-medium md:text-xl";
    const titleBaseClasses = "mt-2 mb-2 text-accent-color text-3xl font-bold md:text-4xl";
    
    const combinedTitleClasses = `${titleBaseClasses} ${titleClass}`.trim();
    const combinedSubtitleClasses = `${subtitleBaseClasses} ${subtitleClass}`.trim();
    
    return (
        <div>
            {title && (
                <h2 className={combinedTitleClasses}>
                    {title}
                </h2>
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