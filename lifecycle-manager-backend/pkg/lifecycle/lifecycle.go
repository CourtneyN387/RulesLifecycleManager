package lifecycle

type AddRequest struct {
	Set         string `json:"set"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Rule        Rule   `json:"rule"`
	Active      bool   `json:"active"`
}

type AddResponse struct {
	Success bool `json:"success"`
}

type ViewResponse struct {
	Rules []*RuleItem `json:"rules"`
}

type Error struct {
	Message string `json:"error"`
}

type RuleItem struct {
	Set         string `json:"set"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Rule        Rule   `json:"rule"`
	Active      bool   `json:"active"`
	ID          string `json:"id"`
}

type Rule struct {
	Salience string `json:"salience"`
	When     string `json:"when"`
	Then     string `json:"then"`
}
