type Props = { section?: string };

export default function RobotAssistant({ section = "FOLLOWING" }: Props) {
  return (
    <div className="guide-robot" aria-hidden="true">
      <div className="guide-robot__antenna" />
      <div className="guide-robot__head"><span /><span /></div>
      <div className="guide-robot__neck" />
      <div className="guide-robot__body"><i /><i /><i /></div>
      <div className="guide-robot__arm guide-robot__arm--left" />
      <div className="guide-robot__arm guide-robot__arm--right" />
      <div className="guide-robot__hand guide-robot__hand--left" />
      <div className="guide-robot__hand guide-robot__hand--right" />
      <div className="guide-robot__leg guide-robot__leg--left" />
      <div className="guide-robot__leg guide-robot__leg--right" />
      <div className="guide-robot__foot guide-robot__foot--left" />
      <div className="guide-robot__foot guide-robot__foot--right" />
      <div className="guide-robot__signal" />
      <span className="guide-robot__label mono">{section}</span>
    </div>
  );
}
