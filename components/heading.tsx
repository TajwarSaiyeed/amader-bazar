interface HeadingProps {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => {
  return (
    <div className="min-w-0 flex-1">
      <h2 className={"text-2xl md:text-3xl font-bold tracking-tight truncate"}>
        {title}
      </h2>
      <p className={"text-sm text-muted-foreground line-clamp-2 mt-1"}>
        {description}
      </p>
    </div>
  );
};
