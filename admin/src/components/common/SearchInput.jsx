import React from "react";
import Icon from "@/components/common/Icon";

const SearchInput = ({ value, onChange, placeholder }) => (
  <div className="relative min-w-[220px] flex-1">
    <Icon
      name="search"
      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
    />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-full border border-slate-200 bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
    />
  </div>
);

export default SearchInput;
