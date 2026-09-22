type Props = { section?: string };

export default function RobotAssistant({ section = "FOLLOWING" }: Props) {
  return (
    <div className="guide-robot" data-guide-robot aria-label="Studio guide robot" role="img">
      <div className="guide-robot__antenna" />
      <div className="guide-robot__head">
        <span className="guide-robot__eye" />
        <span className="guide-robot__eye" />
      </div>
      <div className="guide-robot__neck" />
      <div className="guide-robot__body">
        <span className="guide-robot__panel" />
        <span className="guide-robot__indicator" />
      </div>
      <div className="guide-robot__arm guide-robot__arm--left" />
      <div className="guide-robot__arm guide-robot__arm--right" />
      <div className="guide-robot__hand guide-robot__hand--left" />
      <div className="guide-robot__hand guide-robot__hand--right" />
      <div className="guide-robot__leg guide-robot__leg--left" />
      <div className="guide-robot__leg guide-robot__leg--right" />
      <div className="guide-robot__foot guide-robot__foot--left" />
      <div className="guide-robot__foot guide-robot__foot--right" />
      <div className="guide-robot__signal" />
      <span className="guide-robot__label mono" data-guide-label>{section}</span>
    </div>
  );
}
