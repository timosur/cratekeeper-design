import data from "../../../product/sections/settings/data.json";
import type { Settings as SettingsData } from "../../../product/sections/settings/types";
import { Settings } from "./components/Settings";

export default function SettingsPreview() {
  return (
    <Settings
      settings={data.settings as SettingsData}
      onSelectCategory={(id) => console.log("select category", id)}
      onConnectService={(s) => console.log("connect", s)}
      onRelinkService={(s) => console.log("re-link", s)}
      onDisconnectService={(s) => console.log("disconnect", s)}
      onRevealAnthropicKey={() => console.log("reveal anthropic key")}
      onRotateAnthropicKey={(k) => console.log("rotate anthropic key", k.slice(0, 8) + "\u2026")}
      onSelectAnthropicModel={(id) => console.log("select model", id)}
      onTogglePromptCaching={(v) => console.log("prompt caching", v)}
      onSaveFilesystemRoot={(id, path) => console.log("save root", id, path)}
      onTestFilesystemRoot={(id) => console.log("test root", id)}
      onRenameBucket={(id, name) => console.log("rename bucket", id, name)}
      onReorderBuckets={(ids) => console.log("reorder buckets", ids)}
      onAddBucket={() => console.log("add bucket")}
      onDeleteBucket={(id) => console.log("delete bucket", id)}
      onRevealBearerToken={() => console.log("reveal bearer")}
      onCopyBearerToken={() => console.log("copy bearer")}
      onRotateBearerToken={() => console.log("rotate bearer")}
    />
  );
}
