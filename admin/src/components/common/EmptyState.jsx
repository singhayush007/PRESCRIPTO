import React from "react";
import Icon from "@/components/common/Icon";

const EmptyState = ({ icon = "calendar", title, text }) => (
  <div className="flex flex-col items-center px-6 py-14 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
      <Icon name={icon} className="h-7 w-7" />
    </span>
    <p className="mt-4 font-semibold">{title}</p>
    {text && <p className="mt-1 max-w-xs text-sm text-ink-soft">{text}</p>}
  </div>
);

export default EmptyState;
