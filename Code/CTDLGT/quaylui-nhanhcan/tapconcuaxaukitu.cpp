#include<bits/stdc++.h>
using namespace std;

int n;
string s;
vector<string> vt;

void Try(int start,string ss){
    if(start==n) return;
    for(int i=start;i<n;i++){
        ss+=s[i];
        vt.push_back(ss);
        Try(i+1,ss);
        ss.pop_back(); 
    }
}

void solve(){
    vt.clear();
    cin>>n>>s;
    sort(s.begin(),s.end());
    Try(0,"");
    for(auto x:vt){
        cout<<x<<" \n"[x==vt.back()];
    }
}
void Solve()
{
    vt.clear();
    cin >> n >> s;
    sort(s.begin(), s.end());
    Try(0, "");
    sort(vt.begin(), vt.end());
    for (auto x : vt)
    	cout << x << " ";
    	cout<<endl; 
}
int main(){
    int t;
    cin>>t;
    while(t--){
        Solve();
    }
    return 0;
}
