import { createClient } from "@supabase/supabase-js";

interface DomainWhitelistPolicy {
  domains: string[];
  allow_subdomains?: boolean;
}

/**
 * Validates if the current widget origin is whitelisted for the agent
 * Used during widget initialization to prevent loading on unauthorized domains
 */
export const validateWidgetDomain = async (
  agentId: string
): Promise<{ allowed: boolean; error?: string }> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return { allowed: true };
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get current origin - handle special cases like about:srcdoc in iframes
    const currentOrigin = window.location.origin;

    let currentDomain: string;
    try {
      currentDomain = new URL(currentOrigin).hostname;
    } catch {
      // Handle special origins like about:srcdoc
      currentDomain = currentOrigin;
    }

    // Fetch domain whitelist policy for this agent
    const { data, error } = await supabase
      .from("agent_security_policies")
      .select("policy_value")
      .eq("agent_id", agentId)
      .eq("policy_type", "domain_whitelist")
      .eq("enabled", true)
      .maybeSingle();

    // If error occurs, allow the widget to load (fail-open for better UX)
    if (error) {
      return { allowed: true };
    }

    // If no policy exists, allow all origins (backward compatibility)
    if (!data) {
      return { allowed: true };
    }

    // Validate domain against whitelist
    // Handle both JSONB object and stringified JSON
    const policyValue = typeof data.policy_value === 'string'
      ? JSON.parse(data.policy_value)
      : data.policy_value;
    const policy = policyValue as DomainWhitelistPolicy;
    const allowSubdomains = policy.allow_subdomains !== false;

    const isAllowed = isDomainWhitelisted(
      currentDomain,
      policy.domains,
      allowSubdomains
    );

    if (!isAllowed) {
      const errorMsg = `Domain '${currentDomain}' is not whitelisted for this agent`;
      return {
        allowed: false,
        error: errorMsg,
      };
    }

    return { allowed: true };
  } catch {
    // On exception, allow the widget to load (fail-open)
    return { allowed: true };
  }
};

/**
 * Checks if a domain matches the whitelist
 * Supports exact match, subdomain matching, and wildcard "*"
 */
function isDomainWhitelisted(
  currentDomain: string,
  whitelistedDomains: string[],
  allowSubdomains: boolean
): boolean {
  // If no domains are whitelisted (empty array = no restriction)
  if (!whitelistedDomains || whitelistedDomains.length === 0) {
    return true;
  }

  // Wildcard: "*" allows all domains
  if (whitelistedDomains.includes("*")) {
    return true;
  }

  // Exact match
  if (whitelistedDomains.includes(currentDomain)) {
    return true;
  }

  // Subdomain matching
  if (allowSubdomains) {
    return whitelistedDomains.some((whitelisted) => {
      // Check if currentDomain is a subdomain of whitelisted domain
      return currentDomain.endsWith(`.${whitelisted}`);
    });
  }

  return false;
}
